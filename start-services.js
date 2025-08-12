const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting WhatsApp Bot Services...\n');

// Function to start a service
function startService(name, command, args, cwd = process.cwd()) {
    console.log(`📦 Starting ${name}...`);
    
    const child = spawn(command, args, {
        cwd: cwd,
        stdio: 'inherit',
        shell: true
    });
    
    child.on('error', (error) => {
        console.error(`❌ Failed to start ${name}:`, error.message);
    });
    
    child.on('close', (code) => {
        console.log(`📦 ${name} exited with code ${code}`);
    });
    
    return child;
}

// Check if we should start all services or just one
const service = process.argv[2];

if (!service || service === 'all') {
    console.log('Starting all services...\n');
    
    // Start Laravel backend
    const laravel = startService('Laravel Backend', 'php', ['artisan', 'serve'], path.join(process.cwd(), 'laravel-backend'));
    
    // Wait a bit for Laravel to start
    setTimeout(() => {
        // Start Node.js bot server
        const botServer = startService('Node.js Bot Server', 'npm', ['run', 'bot-server']);
        
        // Wait a bit for bot server to start
        setTimeout(() => {
            // Start Vue.js frontend
            const frontend = startService('Vue.js Frontend', 'npm', ['run', 'dev'], path.join(process.cwd(), 'frontend'));
        }, 3000);
    }, 3000);
    
} else if (service === 'laravel') {
    startService('Laravel Backend', 'php', ['artisan', 'serve'], path.join(process.cwd(), 'laravel-backend'));
    
} else if (service === 'bot-server') {
    startService('Node.js Bot Server', 'npm', ['run', 'bot-server']);
    
} else if (service === 'frontend') {
    startService('Vue.js Frontend', 'npm', ['run', 'dev'], path.join(process.cwd(), 'frontend'));
    
} else {
    console.log('Usage:');
    console.log('  node start-services.js          - Start all services');
    console.log('  node start-services.js laravel  - Start Laravel backend only');
    console.log('  node start-services.js bot-server - Start Node.js bot server only');
    console.log('  node start-services.js frontend - Start Vue.js frontend only');
    console.log('\nServices:');
    console.log('  - Laravel Backend: https://chatbot.soexplast.com');
    console.log('  - Node.js Bot Server: http://localhost:3000');
    console.log('  - Vue.js Frontend: http://localhost:5173');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down services...');
    process.exit(0);
}); 