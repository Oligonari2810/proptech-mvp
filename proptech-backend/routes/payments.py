import stripe
from flask import request, jsonify, Blueprint
from datetime import datetime
import os
from models import db, User

# Configurar Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_51234567890abcdef')

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/subscription/create', methods=['POST'])
def create_subscription():
    """Crear suscripción de broker"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        plan_type = data.get('plan_type')  # 'broker_basic', 'broker_pro'
        email = data.get('email')
        
        # Precios en centavos
        prices = {
            'broker_basic': 4900,  # $49/mes
            'broker_pro': 9900     # $99/mes
        }
        
        if plan_type not in prices:
            return jsonify({'error': 'Plan no válido'}), 400
        
        # Crear customer en Stripe
        customer = stripe.Customer.create(
            email=email,
            metadata={'user_id': str(user_id)}
        )
        
        # Crear producto y precio
        product = stripe.Product.create(
            name=f"HabitatPro {plan_type}",
            description=f"Plan {plan_type} para brokers"
        )
        
        price = stripe.Price.create(
            product=product.id,
            unit_amount=prices[plan_type],
            currency='usd',
            recurring={'interval': 'month'}
        )
        
        # Crear suscripción
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{'price': price.id}],
            expand=['latest_invoice.payment_intent']
        )
        
        # Actualizar usuario en BD
        user = User.query.get(user_id)
        if user:
            user.subscription_type = plan_type
            user.subscription_status = 'active'
            user.stripe_customer_id = customer.id
            user.subscription_start = datetime.utcnow()
            db.session.commit()
        
        return jsonify({
            'status': 'success',
            'subscription_id': subscription.id,
            'client_secret': subscription.latest_invoice.payment_intent.client_secret,
            'customer_id': customer.id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payments_bp.route('/subscription/status', methods=['GET'])
def get_subscription_status():
    """Obtener estado de suscripción"""
    try:
        user_id = request.args.get('user_id')
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify({
            'subscription_type': user.subscription_type,
            'subscription_status': user.subscription_status,
            'subscription_start': user.subscription_start.isoformat() if user.subscription_start else None
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payments_bp.route('/subscription/cancel', methods=['POST'])
def cancel_subscription():
    """Cancelar suscripción"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        user = User.query.get(user_id)
        if not user or not user.stripe_customer_id:
            return jsonify({'error': 'Usuario sin suscripción'}), 404
        
        # Cancelar en Stripe
        subscriptions = stripe.Subscription.list(customer=user.stripe_customer_id)
        for sub in subscriptions.data:
            stripe.Subscription.modify(sub.id, cancel_at_period_end=True)
        
        # Actualizar en BD
        user.subscription_status = 'cancelled'
        db.session.commit()
        
        return jsonify({'status': 'success', 'message': 'Suscripción cancelada'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
