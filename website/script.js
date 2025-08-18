document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-links a:not(.discord-btn)');
    const pages = document.querySelectorAll('.page');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetId) {
                    page.classList.add('active');
                }
            });
            
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const commandSearch = document.getElementById('command-search');
    commandSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const commandCards = document.querySelectorAll('.command-card');
        
        commandCards.forEach(card => {
            const commandName = card.querySelector('h3').textContent.toLowerCase();
            const commandDesc = card.querySelector('p').textContent.toLowerCase();
            const commandCategory = card.getAttribute('data-category').toLowerCase();
            
            if (commandName.includes(searchTerm) || commandDesc.includes(searchTerm) || commandCategory.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Komutlar
    const commands = {
        "Genel": [
            { name: 'help', description: 'Botun tüm komutlarını gösterir', usage: '/help' },
            { name: 'ping', description: 'Botun gecikme süresini gösterir', usage: '/ping' },
            { name: 'uptime', description: 'Botun çalışma süresini gösterir', usage: '/uptime' },
            { name: 'invite', description: 'Botun davet linkini gönderir', usage: '/invite' }
        ],
        "Kullanıcı": [
            { name: 'avatar', description: 'Kullanıcının avatarını gösterir', usage: '/avatar [@kullanıcı]' },
            { name: 'serverinfo', description: 'Sunucu hakkında bilgi gösterir', usage: '/serverinfo' },
            { name: 'userinfo', description: 'Kullanıcı hakkında bilgi gösterir', usage: '/userinfo [@kullanıcı]' },
            { name: 'write', description: 'Belirtilen mesaj URL\'sini bot olarak yazdırır', usage: '/write [url]' }
        ],
        "Moderasyon": [
            { name: 'role', description: 'Kullanıcıya rol ekler veya kaldırır', usage: '/role [@kullanıcı] [rol]' },
            { name: 'nick', description: 'Bir kullanıcının takma adını değiştirir', usage: '/nick [@kullanıcı] [yen_isim]' },
            { name: 'ban', description: 'Kullanıcıyı sunucudan kalıcı olarak yasaklar', usage: '/ban [@kullanıcı] [sebep]' },
            { name: 'unban', description: 'Yasaklanmış bir kullanıcının yasağını kaldırır', usage: '/unban [kullanıcı-id]' },
            { name: 'kick', description: 'Kullanıcıyı sunucudan atar', usage: '/kick [@kullanıcı] [sebep]' },
            { name: 'mute', description: 'Kullanıcıyı belirli süre susturur', usage: '/mute [@kullanıcı] [süre] [sebep]' },
            { name: 'unmute', description: 'Kullanıcının susturmasını kaldırır', usage: '/unmute [@kullanıcı]' },
            { name: 'warn', description: 'Kullanıcıyı uyarır', usage: '/warn [@kullanıcı] [sebep]' },
            { name: 'clear', description: 'Belirtilen sayıda mesajı siler', usage: '/clear [miktar] [kullanıcı*]' },
        ],
        "Yönetim": [
            { name: 'lock', description: 'Kanalı kilitler/açar', usage: '/lock [aç/kapat]' },
            { name: 'slowmode', description: 'Kanal için yavaş mod ayarlar', usage: '/slowmode [saniye]' },
            { name: 'logs', description: 'Log kanalı ayarlar', usage: '/logs [#kanal]' },
            { name: 'set-welcome', description: 'Hoş geldin mesajı atılacak kanalı ayarlar', usage: '/set-welcome [#kanal]' },
            { name: 'tagall', description: 'Tüm sunucu üyelerinin isim başına tag ekler', usage: '/tagall [tag]' },
            { name: 'automod', description: 'Automode sisteminin kurulumunu yapar', usage: '/automod [aç/kapat]' },
        ],
        "Premium": [
            { name: 'pre-write', description: 'PRE Belirtilen mesaj URL\'sini bot olarak yazdırır', usage: '/pre-write [url]' }
        ]
    };
    
    const commandsGrid = document.querySelector('.commands-grid');
    commandsGrid.innerHTML = '';
    
    for (const [category, categoryCommands] of Object.entries(commands)) {
        categoryCommands.forEach(cmd => {
            const commandCard = document.createElement('div');
            commandCard.className = 'command-card';
            commandCard.setAttribute('data-category', category.toLowerCase());
            
            commandCard.innerHTML = `
                <h3>/${cmd.name} <span class="category-badge">${category}</span></h3>
                <p>${cmd.description}</p>
                <div class="usage">${cmd.usage}</div>
            `;
            
            commandsGrid.appendChild(commandCard);
        });
    }

if (document.body.classList.contains('legal-page')) {
    window.addEventListener('load', function() {
        window.scrollTo(0, 0);
        
        if (window.location.hash) {
            setTimeout(function() {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
                history.pushState(null, null, href);
            }
        });
    });
}



});
