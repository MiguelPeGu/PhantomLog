<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            background-color: #000;
            color: #0f0;
            font-family: 'Courier New', Courier, monospace;
            padding: 40px;
        }
        .container {
            border: 1px solid #0f0;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
        }
        h1 {
            border-bottom: 2px solid #0f0;
            padding-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 5px;
        }
        .detail {
            margin: 20px 0;
            border-bottom: 1px solid #111;
            padding-bottom: 10px;
        }
        .total {
            font-size: 24px;
            font-weight: bold;
            color: #fff;
            margin-top: 20px;
        }
        .footer {
            margin-top: 40px;
            font-size: 10px;
            color: #333;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>PHANTOMLOG CORP.</h1>
        <p>REPORTE DE ADQUISICIÓN ARCANO-DERECHO</p>
        
        <div class="detail">
            <p><strong>Nº FACTURA:</strong> {{ $invoice->n_invoice }}</p>
            <p><strong>FECHA:</strong> {{ $invoice->created_at->format('d/m/Y H:i:s') }}</p>
            <p><strong>INVOCADOR:</strong> {{ $invoice->first_name }} {{ $invoice->last_name }}</p>
            <p><strong>DIRECCIÓN:</strong> {{ $invoice->address }}</p>
        </div>

        <div class="items">
            <p>OBJETOS ADQUIRIDOS:</p>
            <ul>
                @foreach($invoice->details as $detail)
                    <li>{{ $detail->quantity }}x {{ $detail->title }} - {{ number_format($detail->total_with_tax, 2) }} €</li>
                @endforeach
            </ul>
        </div>

        <div class="total">
            TOTAL SELLADO: {{ number_format($invoice->total, 2) }} €
        </div>

        <p style="margin-top: 30px;">LA TRANSACCIÓN HA SIDO COMPLETADA CON ÉXITO. LOS OBJETOS HAN SIDO ASIGNADOS A TU INVENTARIO DE CAMPO.</p>

        <div class="footer">
            PHANTOMLOG CORP - SECTOR DE LOGÍSTICA PARANORMAL<br>
            ESTE ARCHIVO HA SIDO ENCRIPTADO Y TRANSMITIDO AUTOMÁTICAMENTE.
        </div>
    </div>
</body>
</html>
