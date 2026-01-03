'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

interface MortgageCalculatorProps {
  propertyPrice: number;
  propertyId?: number;
}

interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  annualPayment: number;
  roi: number;
  cashFlow: number;
  breakEvenYears: number;
}

export default function MortgageCalculator({ propertyPrice, propertyId }: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8); // 80% default
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2); // 20% default
  const [interestRate, setInterestRate] = useState(6.5); // 6.5% default
  const [loanTerm, setLoanTerm] = useState(30); // 30 años default
  const [monthlyRent, setMonthlyRent] = useState(propertyPrice * 0.005); // 0.5% del valor
  const [monthlyExpenses, setMonthlyExpenses] = useState(propertyPrice * 0.002); // 0.2% del valor
  const [results, setResults] = useState<CalculationResult | null>(null);

  useEffect(() => {
    calculate();
  }, [loanAmount, interestRate, loanTerm, propertyPrice, monthlyRent, monthlyExpenses]);

  const calculate = () => {
    if (propertyPrice <= 0 || loanAmount <= 0) return;

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Cálculo de pago mensual (amortización)
    const monthlyPayment =
      monthlyRate === 0
        ? loanAmount / numberOfPayments
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalAmount - loanAmount;

    // ROI y cash flow
    const annualRent = monthlyRent * 12;
    const annualExpenses = monthlyExpenses * 12;
    const netAnnualIncome = annualRent - annualExpenses;
    const cashFlow = (monthlyRent - monthlyExpenses) * 12 - (monthlyPayment * 12);
    const roi = (netAnnualIncome / downPayment) * 100;
    
    // Break-even (años para recuperar down payment)
    const breakEvenYears = downPayment / netAnnualIncome;

    setResults({
      monthlyPayment: monthlyPayment || 0,
      totalInterest: totalInterest || 0,
      totalAmount: totalAmount || 0,
      annualPayment: monthlyPayment * 12,
      roi: roi || 0,
      cashFlow: cashFlow || 0,
      breakEvenYears: breakEvenYears || 0
    });
  };

  const handleLoanAmountChange = (value: number) => {
    setLoanAmount(value);
    setDownPayment(propertyPrice - value);
  };

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setLoanAmount(propertyPrice - value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Simulador Financiero</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1: Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de la Propiedad
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={propertyPrice.toLocaleString()}
                disabled
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pago Inicial (Down Payment)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={Math.round(downPayment)}
                onChange={(e) => handleDownPaymentChange(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((downPayment / propertyPrice) * 100).toFixed(1)}% del precio
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto del Préstamo
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={Math.round(loanAmount)}
                onChange={(e) => handleLoanAmountChange(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tasa de Interés (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plazo del Préstamo (años)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value={15}>15 años</option>
              <option value={20}>20 años</option>
              <option value={25}>25 años</option>
              <option value={30}>30 años</option>
            </select>
          </div>

          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Proyección de Alquiler</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renta Mensual Estimada
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={Math.round(monthlyRent)}
                  onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gastos Mensuales Estimados
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={Math.round(monthlyExpenses)}
                  onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2: Resultados */}
        {results && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados del Cálculo</h3>

            {/* Pago Mensual */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pago Mensual</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${results.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            {/* ROI */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ROI Anual</p>
                  <p className="text-2xl font-bold text-green-900">
                    {results.roi.toFixed(2)}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
            </div>

            {/* Cash Flow */}
            <div className={`rounded-lg p-4 border ${
              results.cashFlow >= 0 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cash Flow Anual</p>
                  <p className={`text-2xl font-bold ${
                    results.cashFlow >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                    ${results.cashFlow.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className={`w-10 h-10 ${
                  results.cashFlow >= 0 ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
            </div>

            {/* Detalles */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900">Desglose Financiero</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total a Pagar:</span>
                  <span className="font-semibold">
                    ${results.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Intereses Totales:</span>
                  <span className="font-semibold">
                    ${results.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pago Anual:</span>
                  <span className="font-semibold">
                    ${results.annualPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break-Even (años):</span>
                  <span className="font-semibold">
                    {results.breakEvenYears.toFixed(1)} años
                  </span>
                </div>
              </div>
            </div>

            {/* Gráfico simple de progreso ROI */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">ROI del Pago Inicial</span>
                <Percent className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(results.roi, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {results.roi > 0 ? 'Inversión rentable' : 'Evaluar estrategia de inversión'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

