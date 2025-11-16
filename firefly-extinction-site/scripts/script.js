document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. GRÁFICO DE DECLÍNIO POPULACIONAL (LINHA) ---
    const ctxDecline = document.getElementById('populationDeclineChart').getContext('2d');
    
    // Dados para o Gráfico de Linha (simulando declínio)
    const declineData = {
        labels: ['1990', '2000', '2010', '2020'],
        datasets: [{
            label: 'Declínio Global da População de Vagalumes (1990-2020)',
            data: [100, 80, 55, 30], // Valores relativos (Ex: 100% para 1990)
            borderColor: '#ffeb3b', // Cor do vagalume
            tension: 0.4, // Curva suave
            fill: false,
        }]
    };

    new Chart(ctxDecline, {
        type: 'line',
        data: declineData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Oculta a legenda neste gráfico
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Índice Relativo da População',
                        color: '#e6e6e6'
                    },
                    min: 0,
                    max: 110,
                    ticks: {
                        color: '#e6e6e6'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#e6e6e6'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // --- 2. GRÁFICO DE IMPACTOS NA NATUREZA (ROSCA/DONUT) ---
    const ctxImpacts = document.getElementById('impactsChart').getContext('2d');

    // Dados para o Gráfico de Rosca
    const impactsData = {
        labels: ['Aumento de Insetos Praga', 'Perda de Biodiversidade', 'Cadeias Alimentares Interrompidas', 'Maior Uso de Pesticidas'],
        datasets: [{
            data: [40, 25, 20, 15], // Percentuais de impacto (simulados)
            backgroundColor: [
                '#ffeb3b', // Amarelo (Aumento de Pragas)
                '#5d5d5d', // Cinza Escuro (Biodiversidade)
                '#a8a8a8', // Cinza Médio (Cadeias)
                '#ffc107', // Laranja Claro (Pesticidas)
            ],
            hoverOffset: 4
        }]
    };

    new Chart(ctxImpacts, {
        type: 'doughnut',
        data: impactsData,
        options: {
            responsive: true,
            cutout: '60%', // Tamanho do buraco central (Rosca)
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#e6e6e6',
                        boxWidth: 15,
                        padding: 15,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // ------------------------------------------------------------------
    // --- 3. LÓGICA DO POTE E VAGALUMES (Geração e Animação) ---
    // ------------------------------------------------------------------
    const jarBody = document.querySelector('.jar-body'); // Onde os vagalumes ficarão

    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');

        // Posição inicial aleatória dentro do pote
        const jarWidth = jarBody.offsetWidth;
        const jarHeight = jarBody.offsetHeight;

        const startX = Math.random() * jarWidth;
        const startY = Math.random() * jarHeight;

        firefly.style.left = `${startX}px`;
        firefly.style.top = `${startY}px`;

        jarBody.appendChild(firefly);

        // Animação de movimento dos vagalumes
        animateFirefly(firefly, jarWidth, jarHeight);
    }

    function animateFirefly(firefly, containerWidth, containerHeight) {
        const duration = Math.random() * 5 + 5; // Duração aleatória entre 5 e 10 segundos
        const delay = Math.random() * 2; // Atraso aleatório

        // Posição final aleatória dentro do pote
        const endX = Math.random() * containerWidth;
        const endY = Math.random() * containerHeight;

        firefly.animate([
            { transform: `translate(0, 0)` }, // Posição inicial (já definida por style.left/top)
            { transform: `translate(${endX - parseFloat(firefly.style.left)}px, ${endY - parseFloat(firefly.style.top)}px)` }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });
    }

    

    // --- 4. LÓGICA DO BRILHO DO MOUSE (VAGALUME) ---
    // ------------------------------------------------------------------
    const mouseGlow = document.getElementById('mouse-glow');

    // Função para mover o brilho
    function updateGlowPosition(e) {
        // Define a posição do brilho baseada nas coordenadas do mouse
        mouseGlow.style.left = `${e.clientX}px`;
        mouseGlow.style.top = `${e.clientY}px`;
    }

    // Função para mostrar o brilho
    function showGlow() {
        mouseGlow.style.opacity = 1;
    }

    // Função para esconder o brilho
    function hideGlow() {
        mouseGlow.style.opacity = 0;
    }

    // Adiciona o rastreador de movimento
    document.addEventListener('mousemove', updateGlowPosition);

    // Adiciona o evento para mostrar o brilho quando o mouse entra na janela
    document.body.addEventListener('mouseenter', showGlow);
    
    // Adiciona o evento para esconder o brilho quando o mouse sai da janela
    document.body.addEventListener('mouseleave', hideGlow);


    // Gerar um número de vagalumes
    const numberOfFireflies = 15; // Você pode ajustar este número
    for (let i = 0; i < numberOfFireflies; i++) {
        createFirefly();
    }
});