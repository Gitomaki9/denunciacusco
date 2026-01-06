// Scripts extraídos de recuperar_contrasena.html
function nextStep(step) {
    // Ocultar todos los pasos
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar el paso actual
    document.getElementById('formStep' + step).classList.add('active');
    
    // Actualizar indicador de pasos
    document.querySelectorAll('.step').forEach((s, index) => {
        if (index + 1 < step) {
            s.classList.add('completed');
            s.classList.remove('active');
        } else if (index + 1 === step) {
            s.classList.add('active');
            s.classList.remove('completed');
        } else {
            s.classList.remove('active', 'completed');
        }
    });
}

function prevStep(step) { nextStep(step); }

function moveToNext(input, nextIndex) {
    if (input.value.length === 1) {
        const nextInput = document.querySelectorAll('.code-input')[nextIndex];
        if (nextInput) { nextInput.focus(); }
    }
}

function resendCode() { alert('Se ha reenviado el código de verificación a tu correo electrónico.'); }

function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.getElementById('passwordStrength');
    
    // Reiniciar
    strengthBar.className = 'password-strength';
    document.querySelectorAll('.requirement').forEach(req => { req.classList.remove('met'); });
    
    let strength = 0;
    if (password.length >= 8) { strength++; document.getElementById('reqLength').classList.add('met'); }
    if (/[A-Z]/.test(password)) { strength++; document.getElementById('reqUppercase').classList.add('met'); }
    if (/[a-z]/.test(password)) { strength++; document.getElementById('reqLowercase').classList.add('met'); }
    if (/[0-9]/.test(password)) { strength++; document.getElementById('reqNumber').classList.add('met'); }
    if (/[^A-Za-z0-9]/.test(password)) { strength++; document.getElementById('reqSpecial').classList.add('met'); }

    if (strength > 0) {
        if (strength <= 2) strengthBar.classList.add('weak');
        else if (strength <= 4) strengthBar.classList.add('medium');
        else strengthBar.classList.add('strong');
    }
}

function checkPasswordMatch() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchElement = document.getElementById('passwordMatch');
    
    if (confirmPassword === '') { matchElement.textContent = ''; matchElement.style.color = ''; }
    else if (password === confirmPassword) { matchElement.textContent = '✓ Las contraseñas coinciden'; matchElement.style.color = 'var(--success-color)'; }
    else { matchElement.textContent = '✗ Las contraseñas no coinciden'; matchElement.style.color = 'var(--danger-color)'; }
}

function completeRecovery() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) { alert('Las contraseñas no coinciden. Por favor, verifica.'); return; }
    if (password.length < 8) { alert('La contraseña debe tener al menos 8 caracteres.'); return; }
    nextStep(4);
}

function goToLogin() { window.location.href = 'index.html'; }

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.code-input')?.focus();
});
