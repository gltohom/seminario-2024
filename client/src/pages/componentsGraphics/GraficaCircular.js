import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function GraficaCircular (){

    const [data, setData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3004/graficaCircular");
            const result = await response.json();
            //para listar los datos recuperados 
            const labels = result.map(item => item.tipo);
            const totals = result.map(item => item.total);

            setData({
                labels: labels,
                datasets: [{
                    label: 'Total por Tipo de Prueba',
                    data: totals,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F4511E', '#6a1b9a', '#388e3c'], // Colores para las porciones
                }],
            });
        };

        fetchData();
    }, []);

    return(
        <Pie data={data}/>
    );
};

export default GraficaCircular; 


