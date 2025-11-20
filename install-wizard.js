#!/usr/bin/env node

/**
 * Weather Intelligence System - Installation Wizard
 * Interactive setup script for easy configuration
 */

const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🌤️  Weather Intelligence System - Installation Wizard');
console.log('='.repeat(60));
console.log('\nThis wizard will help you set up the application.\n');

const questions = [
  {
    key: 'MONGODB_URI',
    prompt: '📦 MongoDB Atlas URI (required): ',
    required: true,
    default: 'mongodb+srv://username:password@cluster.mongodb.net/weather-intelligence'
  },
  {
    key: 'PORT',
    prompt: '🔌 Server Port (default 5000): ',
    required: false,
    default: '5000'
  },
  {
    key: 'EMAIL_USER',
    prompt: '📧 Email address (for notifications, optional): ',
    required: false,
    default: ''
  },
  {
    key: 'EMAIL_PASSWORD',
    prompt: '🔑 Email app password (optional): ',
    required: false,
    default: ''
  },
  {
    key: 'VISUAL_CROSSING_API_KEY',
    prompt: '🌦️  Visual Crossing API key (optional): ',
    required: false,
    default: ''
  },
  {
    key: 'YOUTUBE_API_KEY',
    prompt: '🎥 YouTube API key (optional): ',
    required: false,
    default: ''
  }
];

const config = {};
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion >= questions.length) {
    createEnvFile();
    return;
  }

  const q = questions[currentQuestion];
  rl.question(q.prompt, (answer) => {
    const value = answer.trim() || q.default;
    
    if (q.required && !value) {
      console.log('❌ This field is required!');
      askQuestion();
      return;
    }
    
    config[q.key] = value;
    currentQuestion++;
    askQuestion();
  });
}

function createEnvFile() {
  rl.close();
  
  console.log('\n📝 Creating .env file...');
  
  // Read template
  const template = fs.readFileSync('.env.example', 'utf8');
  let envContent = template;
  
  // Replace values
  Object.keys(config).forEach(key => {
    if (config[key]) {
      const regex = new RegExp(`${key}=.*`, 'g');
      envContent = envContent.replace(regex, `${key}=${config[key]}`);
    }
  });
  
  // Set defaults
  if (!config.EMAIL_USER) {
    envContent = envContent.replace(/EMAIL_HOST=.*/g, 'EMAIL_HOST=smtp.gmail.com');
    envContent = envContent.replace(/EMAIL_PORT=.*/g, 'EMAIL_PORT=587');
  }
  
  // Write .env file
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created successfully!\n');
  
  // Ask about installing dependencies
  const rl2 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl2.question('📦 Install dependencies now? (y/n): ', (answer) => {
    rl2.close();
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      installDependencies();
    } else {
      showNextSteps();
    }
  });
}

function installDependencies() {
  console.log('\n📥 Installing dependencies...\n');
  
  console.log('Installing backend dependencies...');
  exec('cd backend && npm install', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Backend installation failed:', error);
      return;
    }
    console.log('✅ Backend dependencies installed');
    
    console.log('\nInstalling frontend dependencies...');
    exec('cd frontend && npm install', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Frontend installation failed:', error);
        return;
      }
      console.log('✅ Frontend dependencies installed\n');
      
      showNextSteps();
    });
  });
}

function showNextSteps() {
  console.log('\n' + '='.repeat(60));
  console.log('✅ Installation Complete!');
  console.log('='.repeat(60));
  console.log('\n🚀 To start the application:\n');
  console.log('   npm run dev              (Start both servers)');
  console.log('   OR');
  console.log('   ./start.sh              (Using start script)');
  console.log('   OR');
  console.log('   Backend:  cd backend && npm run dev');
  console.log('   Frontend: cd frontend && npm start');
  console.log('\n🌐 Access URLs:');
  console.log('   Frontend:  http://localhost:3000');
  console.log('   Backend:   http://localhost:5000');
  console.log('   GraphQL:   http://localhost:5000/graphql');
  console.log('\n📚 Documentation:');
  console.log('   README.md          - Complete guide');
  console.log('   QUICKSTART.md      - Quick setup');
  console.log('   API_KEYS_GUIDE.md  - API configuration');
  console.log('\n💡 Need API keys?');
  console.log('   See API_KEYS_GUIDE.md for detailed instructions');
  console.log('\n🎉 Happy coding!\n');
  
  process.exit(0);
}

// Start the wizard
askQuestion();
