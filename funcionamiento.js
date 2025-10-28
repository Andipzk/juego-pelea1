const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        let gameRunning = false;
        let punches = 0;
        let currentRound = 1;
        let isPunching = false;
        let punchAnimation = 0;
        let playerDodging = 0;

        const romanticMessages = [
            "Eres mi perrrrrrrssona favorita ",
            "Contigo cada dia es mejorrrr",
            "Me haces feliz que cuando estoy contigo me siento seguro",
            "Eres mi luz ",
            "Tu sonrisa es mi favorita ",
            "Gracias por estos dias y los que aun nos faltan ",
            "me encanta estar a tu lado",
            "eres mi casita",
            "Contigo estoy feliz y tranquilo",
            "Te necesito a mi lado siempre",
        ];

        let currentMessage = "";
        let messageOpacity = 0;

        const playerCatImg = new Image();
        playerCatImg.src = 'gatopeleaplayer.png';
        const opponentCatImg = new Image();
        opponentCatImg.src = 'oponenteawonao.png';

        const playerCat = {
            x: 0,
            baseY: 0,
            y: 0,
            scale: 1,
            health: 3
        };

        const opponentCat = {
            x: 0,
            baseY: 0,
            y: 0,
            scale: 1,
            hitAnimation: 0,
            isPunching: false,
            punchAnimation: 0,
            nextAttackTime: 0
        };

        let crowd = [];
        let particles = [];
        let confetti = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            playerCat.x = canvas.width * 0.3;
            playerCat.baseY = canvas.height * 0.6;
            playerCat.y = playerCat.baseY;
            opponentCat.x = canvas.width * 0.7;
            opponentCat.baseY = canvas.height * 0.6;
            opponentCat.y = opponentCat.baseY;
            
            generateCrowd();
        }
        
        function generateCrowd() {
            crowd = [];
            const crowdCount = Math.min(60, Math.floor(canvas.width / 15));
            for (let i = 0; i < crowdCount; i++) {
                const section = Math.floor(Math.random() * 3);
                crowd.push({
                    x: (Math.random() * canvas.width * 0.8) + canvas.width * 0.1,
                    y: 30 + section * (canvas.height * 0.12),
                    color: ['#FF6B9D', '#4ECDC4', '#FFD93D', '#6BCB77', '#A459D1', '#FF8C42'][Math.floor(Math.random() * 6)],
                    cheer: Math.random() > 0.5,
                    cheerOffset: Math.random() * Math.PI * 2,
                    size: 8 + Math.random() * 4
                });
            }
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' && gameRunning) {
                e.preventDefault();
                punch();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                dodgeLeft();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                dodgeRight();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                stopDodge();
            }
        });

        function punch() {
            if (!gameRunning || isPunching || playerDodging !== 0) return;
            
            isPunching = true;
            punchAnimation = 0;
            
            if (!opponentCat.isPunching) {
                punches++;
                currentMessage = romanticMessages[punches - 1];
                messageOpacity = 1;
                opponentCat.hitAnimation = 20;
                createParticles(opponentCat.x - 50, opponentCat.y);
                createConfetti(opponentCat.x, opponentCat.y - 50);
                
                crowd.forEach(p => {
                    if (Math.random() > 0.5) p.cheer = true;
                });
                
                if (punches % 4 === 0 && punches < 12) {
                    currentRound++;
                }
                
                if (punches >= 10) {
                    setTimeout(() => {
                        gameRunning = false;
                        document.getElementById('endScreen').style.display = 'flex';
                    }, 2000);
                }
            }
            
            setTimeout(() => {
                isPunching = false;
            }, 300);
        }

        function dodgeLeft() {
            if (!gameRunning || isPunching) return;
            playerDodging = -1;
            playerCat.x = canvas.width * 0.25;
        }

        function dodgeRight() {
            if (!gameRunning || isPunching) return;
            playerDodging = 1;
            playerCat.x = canvas.width * 0.35;
        }

        function stopDodge() {
            playerDodging = 0;
            playerCat.x = canvas.width * 0.3;
        }

        function opponentAttack() {
            if (!gameRunning || opponentCat.isPunching) return;
            
            opponentCat.isPunching = true;
            opponentCat.punchAnimation = 0;
            
            setTimeout(() => {
                if (playerDodging === 0 && !isPunching) {
                    playerCat.health--;
                    createParticles(playerCat.x + 50, playerCat.y);
                    
                    if (playerCat.health <= 0) {
                        gameRunning = false;
                        alert("¡Oh no! Pero el amor siempre gana. ¡Inténtalo de nuevo! 💕");
                        restartGame();
                    }
                }
                
                setTimeout(() => {
                    opponentCat.isPunching = false;
                    opponentCat.nextAttackTime = Date.now() + 2000 + Math.random() * 2000;
                }, 300);
            }, 400);
        }

        function createParticles(x, y) {
            for (let i = 0; i < 15; i++) {
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 50,
                    color: ['#FF69B4', '#FFD700', '#FF1493', '#FFA07A'][Math.floor(Math.random() * 4)]
                });
            }
        }

        function createConfetti(x, y) {
            for (let i = 0; i < 30; i++) {
                confetti.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() * -8) - 5,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.2,
                    color: ['#FF69B4', '#FFD700', '#FF1493', '#FFA07A', '#87CEEB', '#98FB98'][Math.floor(Math.random() * 6)],
                    size: 5 + Math.random() * 5,
                    life: 100
                });
            }
        }

        function drawRing() {
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#2c3e50');
            gradient.addColorStop(0.4, '#34495e');
            gradient.addColorStop(1, '#1a1a2e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawCrowd();

            const ringTop = canvas.height * 0.5;
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(canvas.width * 0.05, ringTop, canvas.width * 0.9, canvas.height * 0.45);
            
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.strokeRect(
                    canvas.width * 0.05 + i * 8,
                    ringTop + i * 8,
                    canvas.width * 0.9 - i * 16,
                    canvas.height * 0.45 - i * 16
                );
            }

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 3;
            for (let i = 1; i <= 3; i++) {
                const y = ringTop + (canvas.height * 0.45 / 4) * i;
                ctx.beginPath();
                ctx.moveTo(canvas.width * 0.05, y);
                ctx.lineTo(canvas.width * 0.95, y);
                ctx.stroke();
            }

            const corners = [
                [canvas.width * 0.05, ringTop],
                [canvas.width * 0.95, ringTop],
                [canvas.width * 0.05, canvas.height * 0.95],
                [canvas.width * 0.95, canvas.height * 0.95]
            ];
            ctx.fillStyle = '#c0392b';
            corners.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, 12, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        function drawCrowd() {
            crowd.forEach((person) => {
                const cheerY = person.cheer ? Math.sin(Date.now() * 0.005 + person.cheerOffset) * 5 : 0;
                
                ctx.fillStyle = person.color;
                ctx.beginPath();
                ctx.arc(person.x, person.y + cheerY, person.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#FFD8B8';
                ctx.beginPath();
                ctx.arc(person.x, person.y - person.size * 1.3 + cheerY, person.size * 0.8, 0, Math.PI * 2);
                ctx.fill();
                
                if (person.cheer && (isPunching || opponentCat.isPunching)) {
                    ctx.strokeStyle = person.color;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(person.x - person.size * 0.6, person.y + cheerY);
                    ctx.lineTo(person.x - person.size * 1.2, person.y - person.size * 1.2 + cheerY);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(person.x + person.size * 0.6, person.y + cheerY);
                    ctx.lineTo(person.x + person.size * 1.2, person.y - person.size * 1.2 + cheerY);
                    ctx.stroke();
                }
            });

            ctx.fillStyle = 'rgba(52, 73, 94, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height * 0.45);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 2;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.12 * i);
                ctx.lineTo(canvas.width, canvas.height * 0.12 * i);
                ctx.stroke();
            }
        }

        function drawTV() {
            const isMobile = canvas.width < 768;
            const tvW = isMobile ? 200 : 300;
            const tvH = isMobile ? 100 : 150;
            const tvX = canvas.width * 0.5 - tvW/2;
            const tvY = isMobile ? 10 : 50;

            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(tvX - 10, tvY - 10, tvW + 20, tvH + 20);
            ctx.fillStyle = '#34495e';
            ctx.fillRect(tvX, tvY, tvW, tvH);

            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(tvX + 10, tvY + 10, tvW - 20, tvH - (isMobile ? 40 : 60));

            ctx.fillStyle = '#FFD700';
            ctx.font = `bold ${isMobile ? '16px' : '24px'} Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(`ROUND ${currentRound}`, tvX + tvW/2, tvY + tvH - (isMobile ? 20 : 30));

            ctx.fillStyle = '#FF1493';
            ctx.font = `bold ${isMobile ? '14px' : '20px'} Arial`;
            ctx.fillText(`Golpes: ${punches}/10 | ❤️ ${playerCat.health}`, tvX + tvW/2, tvY + tvH - (isMobile ? 5 : 5));

            if (messageOpacity > 0) {
                ctx.fillStyle = `rgba(255, 105, 180, ${messageOpacity})`;
                ctx.font = `bold ${isMobile ? '12px' : '18px'} Arial`;
                const lines = currentMessage.split('\n');
                lines.forEach((line, i) => {
                    ctx.fillText(line, tvX + tvW/2, tvY + 25 + i * (isMobile ? 18 : 25));
                });
                messageOpacity -= 0.01;
            }
        }

        function drawCat(x, y, scale, flipped, isPunching, isHit) {
            ctx.save();
            ctx.translate(x, y);
            if (flipped) ctx.scale(-1, 1);
            
            const s = scale;
            
            if (isHit > 0) {
                ctx.translate(Math.sin(isHit) * 5, 0);
            }

            const usePlayerImg = !flipped && playerCatImg.src && playerCatImg.complete;
            const useOpponentImg = flipped && opponentCatImg.src && opponentCatImg.complete;
            
            if (usePlayerImg || useOpponentImg) {
                const img = usePlayerImg ? playerCatImg : opponentCatImg;
                const imgWidth = 120 * s;
                const imgHeight = 150 * s;
                ctx.drawImage(img, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
                
                const punchOffset = isPunching ? punchAnimation * 3 : 0;
                ctx.fillStyle = '#FF1493';
                ctx.beginPath();
                ctx.arc(-30 * s + punchOffset, 30 * s, 15 * s, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(30 * s, 30 * s, 15 * s, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
                return;
            }

            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.ellipse(0, 0, 40 * s, 50 * s, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, -40 * s, 35 * s, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-25 * s, -65 * s);
            ctx.lineTo(-15 * s, -45 * s);
            ctx.lineTo(-35 * s, -45 * s);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(25 * s, -65 * s);
            ctx.lineTo(15 * s, -45 * s);
            ctx.lineTo(35 * s, -45 * s);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 3 * s;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(-30 * s, -40 * s + i * 15 * s);
                ctx.lineTo(-10 * s, -40 * s + i * 15 * s);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(10 * s, -40 * s + i * 15 * s);
                ctx.lineTo(30 * s, -40 * s + i * 15 * s);
                ctx.stroke();
            }

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(-12 * s, -45 * s, 8 * s, 0, Math.PI * 2);
            ctx.arc(12 * s, -45 * s, 8 * s, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(-12 * s, -45 * s, 4 * s, 0, Math.PI * 2);
            ctx.arc(12 * s, -45 * s, 4 * s, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FF69B4';
            ctx.beginPath();
            ctx.moveTo(0, -35 * s);
            ctx.lineTo(-5 * s, -30 * s);
            ctx.lineTo(5 * s, -30 * s);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2 * s;
            ctx.beginPath();
            ctx.arc(0, -30 * s, 10 * s, 0, Math.PI);
            ctx.stroke();

            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(-15 * s, -38 * s + i * 5 * s);
                ctx.lineTo(-40 * s, -38 * s + i * 3 * s);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(15 * s, -38 * s + i * 5 * s);
                ctx.lineTo(40 * s, -38 * s + i * 3 * s);
                ctx.stroke();
            }

            const punchOffset = isPunching ? punchAnimation * 3 : 0;
            
            ctx.fillStyle = '#FF1493';
            ctx.beginPath();
            ctx.arc(-30 * s + punchOffset, 10 * s, 15 * s, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(30 * s, 10 * s, 15 * s, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#4169E1';
            ctx.fillRect(-25 * s, 30 * s, 50 * s, 30 * s);

            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 8 * s;
            ctx.beginPath();
            ctx.moveTo(35 * s, 20 * s);
            ctx.quadraticCurveTo(60 * s, 0, 55 * s, -20 * s);
            ctx.stroke();

            ctx.restore();
        }

        function drawParticles() {
            particles.forEach((p, index) => {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 50;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5;
                p.life--;

                if (p.life <= 0) {
                    particles.splice(index, 1);
                }
            });
        }

        function drawConfetti() {
            confetti.forEach((c, index) => {
                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate(c.rotation);
                ctx.fillStyle = c.color;
                ctx.globalAlpha = c.life / 100;
                ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
                ctx.globalAlpha = 1;
                ctx.restore();

                c.x += c.vx;
                c.y += c.vy;
                c.vy += 0.3;
                c.rotation += c.rotationSpeed;
                c.life -= 1;

                if (c.life <= 0) {
                    confetti.splice(index, 1);
                }
            });
        }

        function startGame() {
            document.getElementById('startScreen').style.display = 'none';
            if (window.innerWidth <= 768) {
                document.getElementById('controls').style.display = 'flex';
            }
            opponentCat.nextAttackTime = Date.now() + 2000;
            gameRunning = true;
            gameLoop();
        }

        function restartGame() {
            document.getElementById('endScreen').style.display = 'none';
            if (window.innerWidth <= 768) {
                document.getElementById('controls').style.display = 'flex';
            }
            punches = 0;
            currentRound = 1;
            currentMessage = "";
            messageOpacity = 0;
            particles = [];
            confetti = [];
            playerCat.health = 3;
            playerDodging = 0;
            playerCat.x = canvas.width * 0.3;
            opponentCat.isPunching = false;
            opponentCat.nextAttackTime = Date.now() + 2000;
            gameRunning = true;
            gameLoop();
        }

        function gameLoop() {
            if (!gameRunning) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawRing();
            drawTV();
            drawParticles();
            drawConfetti();
            
            if (isPunching && punchAnimation < 15) {
                punchAnimation += 2;
            }
            
            if (opponentCat.isPunching && opponentCat.punchAnimation < 15) {
                opponentCat.punchAnimation += 2;
            }
            
            if (opponentCat.hitAnimation > 0) {
                opponentCat.hitAnimation--;
            }

            if (Date.now() >= opponentCat.nextAttackTime && !opponentCat.isPunching) {
                opponentAttack();
            }

            drawCat(playerCat.x, playerCat.y, 1.2, false, isPunching, 0);
            drawCat(opponentCat.x, opponentCat.y, 1.2, true, opponentCat.isPunching, opponentCat.hitAnimation);

            requestAnimationFrame(gameLoop);

        }
