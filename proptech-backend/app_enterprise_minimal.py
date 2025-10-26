"""
HABITATPRO ENTERPRISE - VERSIÓN MÍNIMA FUNCIONAL
"""
from flask import Flask, jsonify
import os

app = Flask(__name__)
app.config["ENVIRONMENT"] = "ENTERPRISE"
app.config["VERSION"] = "2.0.0-enterprise"

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "environment": "ENTERPRISE", "version": "2.0.0"})

@app.route('/api/properties')
def properties():
    return jsonify({
        "properties": [
            {"id": 1, "title": "Propiedad Enterprise", "price": 300000, "type": "enterprise"}
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
