// backend/index.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Fibonacci API',
            version: '1.0.0',
            description: 'API para generar series de Fibonacci y enviar por correo electrónico',
        },
    },
    apis: ['index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const generateFibonacci = (x, n) => {
    const xDigits = String(x).split('').map(Number);
    xDigits.sort((a, b) => a - b);
    const series = [xDigits[0], xDigits[1]];
    for (let i = 2; i < n; i++) {
        series.push(series[i - 1] + series[i - 2]);
    }
    return series.reverse();
};

/**
 * @swagger
 * /fibonacci:
 *   get:
 *     summary: Generar una serie Fibonacci
 *     parameters:
 *       - in: query
 *         name: x
 *         required: true
 *         type: integer
 *         description: Minutos de la hora actual
 *       - in: query
 *         name: n
 *         required: true
 *         type: integer
 *         description: Segundos de la hora actual
 *     responses:
 *       200:
 *         description: Serie Fibonacci generada
 */
app.get('/fibonacci', (req, res) => {
    const { x, n } = req.query;
    const series = generateFibonacci(parseInt(x), parseInt(n));
    res.json(series);
});

app.post('/send-email', (req, res) => {
    const { email, time, fibonacciNumbers } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pruebatecnicaproteccion@gmail.com',
            pass: 'adry hhiw sfaf egul',
        },
    });

    const mailOptions = {
        from: 'pruebatecnicaproteccion@gmail.com',
        to: email,
        subject: `Prueba Técnica – Serie Fibonacci`,
        text: `Hora de generación: ${time}\nSerie Fibonacci: ${fibonacciNumbers.join(', ')}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.send('Correo enviado: ' + info.response);
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});



// V23FQBX9QEJQRLR2BMTLXNT8