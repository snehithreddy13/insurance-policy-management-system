<<<<<<< HEAD
// API Base URL
const API_URL = 'http://localhost:3000/api';

// Global Variables
let currentUser = null;
let allPolicies = [];
let authToken = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        showDashboard();
        loadUserData();
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add Policy form submission
    const addPolicyForm = document.getElementById('addPolicyForm');
    if (addPolicyForm) {
        addPolicyForm.addEventListener('submit', handleAddPolicy);
    }

    // Document form submission
    const documentForm = document.getElementById('documentForm');
    if (documentForm) {
        documentForm.addEventListener('submit', handleDocumentUpload);
    }

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('keyup', formatCardNumber);
    }

    // Format expiry date input
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('keyup', formatExpiry);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const policyModal = document.getElementById('policyModal');
        const paymentModal = document.getElementById('paymentModal');
        const historyModal = document.getElementById('historyModal');

        if (event.target === policyModal) {
            policyModal.classList.remove('active');
        }
        if (event.target === paymentModal) {
            paymentModal.classList.remove('active');
        }
        if (event.target === historyModal) {
            historyModal.classList.remove('active');
        }
    });
});

// ==================== AUTHENTICATION ====================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            showDashboard();
            loadUserData();
        } else {
            alert('Login failed: ' + (data.message || 'Invalid credentials'));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error during login. Please check your connection.');
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    currentUser = null;
    allPolicies = [];

    // Reset forms
    document.getElementById('loginForm').reset();

    // Show login modal
    const loginModal = document.getElementById('loginModal');
    const dashboard = document.getElementById('dashboard');

    loginModal.classList.add('active');
    dashboard.classList.add('hidden');
}

// ==================== DASHBOARD FUNCTIONS ====================
function showDashboard() {
    const loginModal = document.getElementById('loginModal');
    const dashboard = document.getElementById('dashboard');

    loginModal.classList.remove('active');
    dashboard.classList.remove('hidden');
}

async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            currentUser = await response.json();
            updateDashboard();
            loadPolicies();
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function updateDashboard() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('profileImg').src = generateAvatar(currentUser.name);

        // Update status badge
        const statusBadge = document.getElementById('statusBadge');
        if (currentUser.status) {
            statusBadge.textContent = currentUser.status + ' Member';
            statusBadge.className = 'badge badge-' + currentUser.status.toLowerCase();
        }
    }
}

function generateAvatar(name) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');

    // Generate random color based on name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
    ctx.fillRect(0, 0, 40, 40);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 20, 20);

    return canvas.toDataURL();
}

async function loadPolicies() {
    try {
        const response = await fetch(`${API_URL}/policies`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            allPolicies = await response.json();
            displayPolicies();
            updateStatistics();
            loadPaymentOptions();
        }
    } catch (error) {
        console.error('Error loading policies:', error);
    }
}

function displayPolicies() {
    const policiesList = document.getElementById('policiesList');
    policiesList.innerHTML = '';

    if (allPolicies.length === 0) {
        policiesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px 0;">No policies found</p>';
        return;
    }

    allPolicies.forEach(policy => {
        const policyCard = document.createElement('div');
        policyCard.className = 'policy-card';
        policyCard.innerHTML = `
            <div class="policy-header">
                <div class="policy-name">${policy.policy_name}</div>
                <div class="policy-type-badge">${policy.policy_type || 'General'}</div>
            </div>
            <div class="policy-id" style="font-size: 0.9em; color: var(--text-secondary);">Policy ID: ${policy.id}</div>
            <div class="policy-body">
                <div class="policy-detail">
                    <div class="detail-label">Sum Assured</div>
                    <div class="detail-value">₹${parseFloat(policy.sum_assured).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                </div>
                <div class="policy-detail">
                    <div class="detail-label">Premium</div>
                    <div class="detail-value">₹${parseFloat(policy.premium).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                </div>
                <div class="policy-detail">
                    <div class="detail-label">Due Date</div>
                    <div class="detail-value">${new Date(policy.due_date).toLocaleDateString()}</div>
                </div>
                <div class="policy-detail">
                    <div class="detail-label">Status</div>
                    <span class="policy-status status-${policy.status.toLowerCase()}">${policy.status}</span>
                </div>
            </div>
            <div class="policy-footer">
                <button class="btn-details" onclick="viewPolicyDetails(${policy.id})">View Details</button>
                <button class="btn-details" onclick="renewPolicy(${policy.id})">Renew</button>
            </div>
        `;
        policiesList.appendChild(policyCard);
    });
}

function updateStatistics() {
    const activePolicies = allPolicies.filter(p => p.status === 'Active').length;
    const totalPolicies = allPolicies.length;
    const totalPremiumDue = allPolicies
        .filter(p => p.status === 'Active')
        .reduce((sum, p) => sum + parseFloat(p.premium), 0);

    document.getElementById('policiesCount').textContent = totalPolicies;
    document.getElementById('premiumCount').textContent = '$' + totalPremiumDue.toFixed(2);
    document.getElementById('activeCount').textContent = activePolicies;
}

function loadPaymentOptions() {
    const selectPolicy = document.getElementById('selectPolicy');
    selectPolicy.innerHTML = '<option value="">Choose a policy...</option>';

    allPolicies.forEach(policy => {
        const option = document.createElement('option');
        option.value = policy.id;
        option.textContent = `${policy.policy_name} - $${policy.premium}`;
        selectPolicy.appendChild(option);
    });

    // Set default amount when policy is selected
    selectPolicy.addEventListener('change', function() {
        const selectedPolicy = allPolicies.find(p => p.id == this.value);
        if (selectedPolicy) {
            document.getElementById('amount').value = selectedPolicy.premium;
        }
    });
}

// ==================== POLICY FUNCTIONS ====================
function viewPolicyDetails(policyId) {
    const policy = allPolicies.find(p => p.id === policyId);
    if (!policy) return;

    const policyDetails = document.getElementById('policyDetails');
    policyDetails.innerHTML = `
        <div class="policy-details">
            <h3>${policy.policy_name}</h3>
            <div class="detail-row">
                <span>Policy ID:</span>
                <strong>${policy.id}</strong>
            </div>
            <div class="detail-row">
                <span>Sum Assured:</span>
                <strong>₹${parseFloat(policy.sum_assured).toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
            </div>
            <div class="detail-row">
                <span>Premium Amount:</span>
                <strong>₹${parseFloat(policy.premium).toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
            </div>
            <div class="detail-row">
                <span>Due Date:</span>
                <strong>${new Date(policy.due_date).toLocaleDateString()}</strong>
            </div>
            <div class="detail-row">
                <span>Status:</span>
                <strong>${policy.status}</strong>
            </div>
        </div>
    `;

    const policyModal = document.getElementById('policyModal');
    policyModal.classList.add('active');
}

function closePolicyModal() {
    document.getElementById('policyModal').classList.remove('active');
}

function buyTopup() {
    alert('Topup functionality coming soon!');
    closePolicyModal();
}

function renewPolicy(policyId) {
    alert('Policy renewal for ID: ' + policyId + ' coming soon!');
}

// ==================== PAYMENT FUNCTIONS ====================
function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    paymentModal.classList.add('active');
    
    // Populate policy dropdown
    populatePolicyDropdown();
}

function populatePolicyDropdown() {
    const selectPolicy = document.getElementById('selectPolicy');
    selectPolicy.innerHTML = '<option value="">Choose a policy...</option>';
    
    if (allPolicies && allPolicies.length > 0) {
        allPolicies.forEach(policy => {
            const option = document.createElement('option');
            option.value = policy.id;
            option.textContent = `${policy.policy_name} - $${policy.premium}`;
            selectPolicy.appendChild(option);
        });
    }
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    document.getElementById('paymentForm').reset();
}

async function handlePayment(e) {
    e.preventDefault();

    const policyId = document.getElementById('selectPolicy').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    // Basic validation
    if (!policyId || !amount || amount <= 0) {
        alert('Please fill in all payment details');
        return;
    }

    if (cardNumber.length !== 16) {
        alert('Invalid card number');
        return;
    }

    if (!/^\d{3}$/.test(cvv)) {
        alert('Invalid CVV');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                policy_id: policyId,
                amount: amount,
                payment_method: 'card',
                card_name: cardName,
                card_number: cardNumber,
                expiry: expiry,
                cvv: cvv
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Payment successful! Transaction ID: ' + data.transaction_id);
            closePaymentModal();
            loadPolicies();
        } else {
            alert('Payment failed: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Error processing payment');
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = formattedValue;
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function viewPaymentHistory() {
    loadPaymentHistory();
    document.getElementById('historyModal').classList.add('active');
}

async function loadPaymentHistory() {
    try {
        const response = await fetch(`${API_URL}/payments`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const payments = await response.json();
            displayPaymentHistory(payments);
        }
    } catch (error) {
        console.error('Error loading payment history:', error);
    }
}

function displayPaymentHistory(payments) {
    const paymentHistory = document.getElementById('paymentHistory');
    paymentHistory.innerHTML = '';

    if (payments.length === 0) {
        paymentHistory.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No payment history found</p>';
        return;
    }

    payments.forEach(payment => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'payment-item';
        paymentItem.innerHTML = `
            <div class="payment-info">
                <h4>Policy ID: ${payment.policy_id}</h4>
                <div class="payment-date">${new Date(payment.payment_date).toLocaleDateString()}</div>
            </div>
            <div class="payment-amount">₹${parseFloat(payment.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
        `;
        paymentHistory.appendChild(paymentItem);
    });
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('active');
}

// ==================== ADD POLICY MODAL ====================
function openAddPolicyModal() {
    document.getElementById('addPolicyModal').classList.add('active');
}

function closeAddPolicyModal() {
    document.getElementById('addPolicyModal').classList.remove('active');
    document.getElementById('addPolicyForm').reset();
}

async function handleAddPolicy(e) {
    e.preventDefault();

    const policyName = document.getElementById('policyName').value;
    const sumAssured = document.getElementById('sumAssured').value;
    const premium = document.getElementById('premium').value;
    const dueDate = document.getElementById('dueDate').value;

    try {
        const response = await fetch(`${API_URL}/policies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                policy_name: policyName,
                sum_assured: parseFloat(sumAssured),
                premium: parseFloat(premium),
                due_date: dueDate
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Policy added successfully!');
            closeAddPolicyModal();
            loadPolicies(); // Refresh the policies list
        } else {
            alert('Failed to add policy: ' + (data.message || 'Please try again'));
        }
    } catch (error) {
        console.error('Add policy error:', error);
        alert('Error adding policy. Please check your connection.');
    }
}

// ==================== DOCUMENT & VERIFICATION FUNCTIONS ====================
function openDocumentModal() {
    document.getElementById('documentModal').classList.add('active');
    populatePoliciesForDocument();
}

function closeDocumentModal() {
    document.getElementById('documentModal').classList.remove('active');
    document.getElementById('documentForm').reset();
}

function populatePoliciesForDocument() {
    const policySelect = document.getElementById('policySelect');
    policySelect.innerHTML = '<option value="">Select Policy (Optional)</option>';
    
    if (allPolicies && allPolicies.length > 0) {
        allPolicies.forEach(policy => {
            const option = document.createElement('option');
            option.value = policy.id;
            option.textContent = `${policy.policy_name} (${policy.policy_type})`;
            policySelect.appendChild(option);
        });
    }
}

async function handleDocumentUpload(e) {
    e.preventDefault();

    const documentType = document.getElementById('docType').value;
    const policyId = document.getElementById('policySelect').value;
    const docFile = document.getElementById('docFile').files[0];

    if (!documentType) {
        alert('Please select a document type');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/documents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                documentType: documentType,
                policyId: policyId || null
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Document uploaded successfully! Verification pending.');
            closeDocumentModal();
            loadVerificationStatus();
        } else {
            alert('Failed to upload document: ' + (data.message || 'Please try again'));
        }
    } catch (error) {
        console.error('Document upload error:', error);
        alert('Error uploading document. Please check your connection.');
    }
}

function openVerificationModal() {
    document.getElementById('verificationModal').classList.add('active');
    loadVerificationStatus();
}

function closeVerificationModal() {
    document.getElementById('verificationModal').classList.remove('active');
}

async function loadVerificationStatus() {
    try {
        const response = await fetch(`${API_URL}/documents/verification/status`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayVerificationStatus(data);
        }
    } catch (error) {
        console.error('Error loading verification status:', error);
    }
}

function displayVerificationStatus(data) {
    const verificationContent = document.getElementById('verificationContent');
    
    let html = `
        <div class="user-verification">
            <h3>KYC Status: <strong class="status-badge status-${data.overall_status.toLowerCase()}">${data.overall_status}</strong></h3>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${data.user.name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${data.user.email}</p>
        </div>
        <h4 style="margin-top: 20px;">Documents Submitted:</h4>
        <div class="documents-list">
    `;

    if (data.documents && data.documents.length > 0) {
        data.documents.forEach(doc => {
            html += `
                <div class="document-item">
                    <div class="doc-info">
                        <span class="doc-type">${doc.document_type}</span>
                        <span class="doc-status status-${doc.verification_status.toLowerCase()}">${doc.verification_status}</span>
                    </div>
                    <small>${new Date(doc.uploaded_at).toLocaleDateString('en-IN')}</small>
                </div>
            `;
        });
    } else {
        html += '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No documents uploaded yet</p>';
    }

    html += '</div>';
    verificationContent.innerHTML = html;
}

// ==================== QUICK ACTIONS ====================
function downloadStatement() {
    alert('Statement download functionality coming soon!');
}

function openCalculator() {
    const sumAssured = prompt('Enter Sum Assured amount:', '100000');
    if (sumAssured) {
        // Simple premium calculation: 1% of sum assured
        const calculatedPremium = (sumAssured * 0.01).toFixed(2);
        alert(`Estimated Annual Premium: ₹${parseFloat(calculatedPremium).toLocaleString('en-IN', {minimumFractionDigits: 2})}`);
    }
}

function contactAgent() {
    alert('Contact details:\n\nEmail: support@insurehub.com\nPhone: 1-800-INSURE-1\nAvailable 24/7');
}

// ==================== NAVIGATION ====================
function navigateTo(section, event) {
    event.preventDefault();

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Handle section navigation
    switch(section) {
        case 'home':
            alert('Home section - Dashboard');
            break;
        case 'services':
            alert('Services section - Available services coming soon!');
            break;
        case 'history':
            viewPaymentHistory();
            break;
        case 'help':
            alert('Help & Support\n\nEmail: support@insurehub.com\nPhone: 1-800-INSURE-1\nWebsite: www.insurehub.com');
            break;
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
=======
// API Base URL
const API_URL = 'http://localhost:3000/api';

// Global Variables
let currentUser = null;
let allPolicies = [];
let authToken = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // --- Profile Dropdown Click ---
    const userProfile = document.querySelector('.user-profile');
    const dropdownMenu = document.querySelector('.user-profile .dropdown-menu');
    if (userProfile && dropdownMenu) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
        });
        document.addEventListener('click', function() {
            dropdownMenu.style.display = 'none';
        });
    }
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        showDashboard();
        loadUserData();
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add Policy form submission
    const addPolicyForm = document.getElementById('addPolicyForm');
    if (addPolicyForm) {
        addPolicyForm.addEventListener('submit', handleAddPolicy);
    }

    // Document form submission
    const documentForm = document.getElementById('documentForm');
    if (documentForm) {
        documentForm.addEventListener('submit', handleDocumentUpload);
    }

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('keyup', formatCardNumber);
    }

    // Format expiry date input
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('keyup', formatExpiry);
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const policyModal = document.getElementById('policyModal');
        const paymentModal = document.getElementById('paymentModal');
        const historyModal = document.getElementById('historyModal');

        if (event.target === policyModal) {
            policyModal.classList.remove('active');
        }
        if (event.target === paymentModal) {
            paymentModal.classList.remove('active');
        }
        if (event.target === historyModal) {
            historyModal.classList.remove('active');
        }
    });
});

// ==================== AUTHENTICATION ====================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            showDashboard();
            loadUserData();
        } else {
            alert('Login failed: ' + (data.message || 'Invalid credentials'));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error during login. Please check your connection.');
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    currentUser = null;
    allPolicies = [];

    // Reset forms
    document.getElementById('loginForm').reset();

    // Show login modal
    const loginModal = document.getElementById('loginModal');
    const dashboard = document.getElementById('dashboard');

    loginModal.classList.add('active');
    dashboard.classList.add('hidden');
}

// ==================== DASHBOARD FUNCTIONS ====================
function showDashboard() {
    const loginModal = document.getElementById('loginModal');
    const dashboard = document.getElementById('dashboard');

    loginModal.classList.remove('active');
    dashboard.classList.remove('hidden');
}

async function loadUserData() {
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            currentUser = await response.json();
            updateDashboard();
            loadPolicies();
        } else if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function updateDashboard() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('profileImg').src = generateAvatar(currentUser.name);

        // Update status badge
        const statusBadge = document.getElementById('statusBadge');
        if (currentUser.status) {
            statusBadge.textContent = currentUser.status + ' Member';
            statusBadge.className = 'badge badge-' + currentUser.status.toLowerCase();
        }
    }
}

function generateAvatar(name) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');

    // Generate random color based on name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
    ctx.fillRect(0, 0, 40, 40);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 20, 20);

    return canvas.toDataURL();
}

async function loadPolicies() {
    try {
        const response = await fetch(`${API_URL}/policies`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            allPolicies = await response.json();
            displayPolicies();
            updateStatistics();
            loadPaymentOptions();
        }
    } catch (error) {
        console.error('Error loading policies:', error);
    }
}

function displayPolicies() {
    const policiesList = document.getElementById('policiesList');
    policiesList.innerHTML = '';

    if (allPolicies.length === 0) {
        policiesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px 0;">No policies found</p>';
        return;
    }

    allPolicies.forEach(policy => {
        const policyCard = document.createElement('div');
        policyCard.className = 'policy-card';
        policyCard.innerHTML = `
            <div class="policy-header">
                <div class="policy-name">${policy.policy_name}</div>
                <div class="policy-type-badge">${policy.policy_type || 'General'}</div>
            </div>
            <div class="policy-id" style="font-size: 0.9em; color: var(--text-secondary);">Policy ID: ${policy.id}</div>
            <div class="policy-body">
                <div class="policy-detail">
                    <div class="detail-label">Sum Assured</div>
                    <div class="detail-value">₹${parseFloat(policy.sum_assured).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                </div>
                <div class="policy-detail">
                    <div class="detail-label">Premium</div>
                    <div class="detail-value">₹${parseFloat(policy.premium).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                </div>
                <div class="policy-detail">
                    <div class="detail-label">Due Date</div>
                    <div class="detail-value">${new Date(policy.due_date).toLocaleDateString()}</div>
                </div>
                <div class="policy-detail">
                    <div class="detail-label">Status</div>
                    <span class="policy-status status-${policy.status.toLowerCase()}">${policy.status}</span>
                </div>
            </div>
            <div class="policy-footer">
                <button class="btn-details" onclick="viewPolicyDetails(${policy.id})">View Details</button>
                <button class="btn-details" onclick="renewPolicy(${policy.id})">Renew</button>
            </div>
        `;
        policiesList.appendChild(policyCard);
    });
}

function updateStatistics() {
    const activePolicies = allPolicies.filter(p => p.status === 'Active').length;
    const totalPolicies = allPolicies.length;
    const totalPremiumDue = allPolicies
        .filter(p => p.status === 'Active')
        .reduce((sum, p) => sum + parseFloat(p.premium), 0);

    document.getElementById('policiesCount').textContent = totalPolicies;
    document.getElementById('premiumCount').textContent = '$' + totalPremiumDue.toFixed(2);
    document.getElementById('activeCount').textContent = activePolicies;

    // --- Notification for due dates ---
    const notifications = document.querySelector('.notifications .notification-badge');
    let dueSoonCount = 0;
    const today = new Date();
    allPolicies.forEach(p => {
        if (p.due_date) {
            const due = new Date(p.due_date);
            const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            if (diffDays <= 2 && diffDays >= 0 && p.status === 'Active') {
                dueSoonCount++;
            }
        }
    });
    notifications.textContent = dueSoonCount > 0 ? dueSoonCount : '';
}

function loadPaymentOptions() {
    const selectPolicy = document.getElementById('selectPolicy');
    selectPolicy.innerHTML = '<option value="">Choose a policy...</option>';

    allPolicies.forEach(policy => {
        const option = document.createElement('option');
        option.value = policy.id;
        option.textContent = `${policy.policy_name} - $${policy.premium}`;
        selectPolicy.appendChild(option);
    });

    // Set default amount when policy is selected
    selectPolicy.addEventListener('change', function() {
        const selectedPolicy = allPolicies.find(p => p.id == this.value);
        if (selectedPolicy) {
            document.getElementById('amount').value = selectedPolicy.premium;
        }
    });
}

// ==================== POLICY FUNCTIONS ====================
function viewPolicyDetails(policyId) {
    const policy = allPolicies.find(p => p.id === policyId);
    if (!policy) return;

    const policyDetails = document.getElementById('policyDetails');
    policyDetails.innerHTML = `
        <div class="policy-details">
            <h3>${policy.policy_name}</h3>
            <div class="detail-row">
                <span>Policy ID:</span>
                <strong>${policy.id}</strong>
            </div>
            <div class="detail-row">
                <span>Sum Assured:</span>
                <strong>₹${parseFloat(policy.sum_assured).toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
            </div>
            <div class="detail-row">
                <span>Premium Amount:</span>
                <strong>₹${parseFloat(policy.premium).toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
            </div>
            <div class="detail-row">
                <span>Due Date:</span>
                <strong>${new Date(policy.due_date).toLocaleDateString()}</strong>
            </div>
            <div class="detail-row">
                <span>Status:</span>
                <strong>${policy.status}</strong>
            </div>
        </div>
    `;

    const policyModal = document.getElementById('policyModal');
    policyModal.classList.add('active');
}

function closePolicyModal() {
    document.getElementById('policyModal').classList.remove('active');
}

function buyTopup() {
    alert('Topup functionality coming soon!');
    closePolicyModal();
}

function renewPolicy(policyId) {
    alert('Policy renewal for ID: ' + policyId + ' coming soon!');
}

// ==================== PAYMENT FUNCTIONS ====================
function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    paymentModal.classList.add('active');
    
    // Populate policy dropdown
    populatePolicyDropdown();
}

function populatePolicyDropdown() {
    const selectPolicy = document.getElementById('selectPolicy');
    selectPolicy.innerHTML = '<option value="">Choose a policy...</option>';
    
    if (allPolicies && allPolicies.length > 0) {
        allPolicies.forEach(policy => {
            const option = document.createElement('option');
            option.value = policy.id;
            option.textContent = `${policy.policy_name} - $${policy.premium}`;
            selectPolicy.appendChild(option);
        });
    }
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    document.getElementById('paymentForm').reset();
}

async function handlePayment(e) {
    e.preventDefault();

    const policyId = document.getElementById('selectPolicy').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    // Basic validation
    if (!policyId || !amount || amount <= 0) {
        alert('Please fill in all payment details');
        return;
    }

    if (cardNumber.length !== 16) {
        alert('Invalid card number');
        return;
    }

    if (!/^\d{3}$/.test(cvv)) {
        alert('Invalid CVV');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                policy_id: policyId,
                amount: amount,
                payment_method: 'card',
                card_name: cardName,
                card_number: cardNumber,
                expiry: expiry,
                cvv: cvv
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Payment successful! Transaction ID: ' + data.transaction_id);
            closePaymentModal();
            loadPolicies();
        } else {
            alert('Payment failed: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Error processing payment');
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = formattedValue;
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function viewPaymentHistory() {
    loadPaymentHistory();
    document.getElementById('historyModal').classList.add('active');
}

async function loadPaymentHistory() {
    try {
        const response = await fetch(`${API_URL}/payments`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const payments = await response.json();
            displayPaymentHistory(payments);
        }
    } catch (error) {
        console.error('Error loading payment history:', error);
    }
}

function displayPaymentHistory(payments) {
    const paymentHistory = document.getElementById('paymentHistory');
    paymentHistory.innerHTML = '';

    if (payments.length === 0) {
        paymentHistory.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No payment history found</p>';
        return;
    }

    payments.forEach(payment => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'payment-item';
        paymentItem.innerHTML = `
            <div class="payment-info">
                <h4>Policy ID: ${payment.policy_id}</h4>
                <div class="payment-date">${new Date(payment.payment_date).toLocaleDateString()}</div>
            </div>
            <div class="payment-amount">₹${parseFloat(payment.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
        `;
        paymentHistory.appendChild(paymentItem);
    });
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('active');
}

// ==================== ADD POLICY MODAL (MULTI-STEP) ====================
const requiredDocuments = {
    'Health Insurance': [
        'Aadhar Card',
        'PAN Card',
        'Medical Report'
    ],
    'Home Insurance': [
        'Aadhar Card',
        'Property Papers',
        'Bank Statement'
    ],
    'Life Insurance': [
        'Aadhar Card',
        'PAN Card',
        'Income Proof'
    ],
    'Vehicle Insurance': [
        'Aadhar Card',
        'RC Book',
        'Driving License',
        'Car Registration',
        'Car Colour',
        'Car Picture',
        'Car Model',
        'Company Name'
    ]
};
    const requiredDocuments = {
        'Health Insurance': [
            'Aadhar Card',
            'PAN Card',
            'Medical Report',
            'Doctor Certificate',
            'Health Membership Number'
        ],
        'Home Insurance': [
            'Aadhar Card',
            'Home Document',
            'Property Papers',
            'Bank Statement',
            'Building Authorization',
            'Utility Bill'
        ],
        'Life Insurance': [
            'Aadhar Card',
            'PAN Card',
            'Income Proof',
            'Nominee Name',
            'Date of Birth',
            'Life Membership Number'
        ],
        'Vehicle Insurance': [
            'Aadhar Card',
            'RC Book',
            'Driving License',
            'Car Registration',
            'Car Colour',
            'Car Picture',
            'Car Model',
            'Company Name'
        ]
    };

let addPolicyDetails = {};

function openAddPolicyModal() {
    document.getElementById('addPolicyModal').classList.add('active');
    document.getElementById('addPolicyStep1').style.display = '';
    document.getElementById('addPolicyStep2').style.display = 'none';
    document.getElementById('addPolicyForm').reset();
    document.getElementById('documentsAccordion').innerHTML = '';
    addPolicyDetails = {};
}

function closeAddPolicyModal() {
    document.getElementById('addPolicyModal').classList.remove('active');
    document.getElementById('addPolicyForm').reset();
    document.getElementById('policyDocumentsForm').reset();
    addPolicyDetails = {};
}

// Step 1: Calculate Premium, Term, Range, Due Date
document.addEventListener('DOMContentLoaded', function() {
    // --- Add Policy Modal Logic ---
    const sumAssuredInput = document.getElementById('sumAssured');
    const monthlyPaymentInput = document.getElementById('monthlyPayment');
    const termMonthsInput = document.getElementById('termMonths');
    const paymentRangeInput = document.getElementById('paymentRange');
    const dueDateInput = document.getElementById('dueDate');
    const calcBtn = document.getElementById('calculatePremiumBtn');
    if (calcBtn) {
        calcBtn.onclick = function() {
            const sumAssured = parseFloat(sumAssuredInput.value);
            const monthlyPayment = parseFloat(monthlyPaymentInput.value);
            if (sumAssured && monthlyPayment) {
                const months = Math.ceil(sumAssured / monthlyPayment);
                termMonthsInput.value = months;
                paymentRangeInput.value = `₹${monthlyPayment.toLocaleString('en-IN', {minimumFractionDigits:2})} x ${months} months`;
                // Set due date to today + months
                const today = new Date();
                today.setMonth(today.getMonth() + months);
                dueDateInput.value = today.toISOString().split('T')[0];
            } else {
                alert('Enter sum assured and monthly payment to calculate.');
            }
        };
    }

    // Next to Step 2
    const nextBtn = document.getElementById('nextToDocumentsBtn');
    if (nextBtn) {
        nextBtn.onclick = function() {
            const policyType = document.getElementById('policyDropdown').value;
            const sumAssured = sumAssuredInput.value;
            const monthlyPayment = monthlyPaymentInput.value;
            const termMonths = termMonthsInput.value;
            const paymentRange = paymentRangeInput.value;
            const dueDate = dueDateInput.value;
            if (!policyType || !sumAssured || !monthlyPayment || !termMonths || !dueDate) {
                alert('Please fill all details and calculate.');
                return;
            }
            addPolicyDetails = {
                policy_name: policyType,
                sum_assured: parseFloat(sumAssured),
                monthly_payment: parseFloat(monthlyPayment),
                term_months: parseInt(termMonths),
                payment_range: paymentRange,
                due_date: dueDate
            };
            showDocumentsAccordion(policyType);
            document.getElementById('addPolicyStep1').style.display = 'none';
            document.getElementById('addPolicyStep2').style.display = '';
        };
    }

    // Back to Step 1
    const backBtn = document.getElementById('backToDetailsBtn');
    if (backBtn) {
        backBtn.onclick = function() {
            document.getElementById('addPolicyStep2').style.display = 'none';
            document.getElementById('addPolicyStep1').style.display = '';
        };
    }

    // Handle final Add Policy (with documents)
    const docsForm = document.getElementById('policyDocumentsForm');
    if (docsForm) {
        docsForm.onsubmit = async function(e) {
            e.preventDefault();
            // Collect document files
            const docInputs = docsForm.querySelectorAll('input[type="file"]');
            let allDocsUploaded = true;
            let formData = new FormData();
            for (let input of docInputs) {
                if (!input.files[0]) {
                    allDocsUploaded = false;
                    break;
                }
                formData.append(input.name, input.files[0]);
            }
            if (!allDocsUploaded) {
                alert('Please upload all required documents.');
                return;
            }
            // Add policy details to formData
            for (let key in addPolicyDetails) {
                formData.append(key, addPolicyDetails[key]);
            }
            try {
                const response = await fetch(`${API_URL}/policies`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: formData
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Policy added successfully!');
                    closeAddPolicyModal();
                    loadPolicies();
                } else {
                    alert('Failed to add policy: ' + (data.message || 'Please try again'));
                }
            } catch (error) {
                console.error('Add policy error:', error);
                alert('Error adding policy. Please check your connection.');
            }
        };
    }

    // --- Payment Modal Logic ---
    const paymentMethodRadios = document.getElementsByName('paymentMethod');
    const cardDetails = document.getElementById('cardDetails');
    const upiDetails = document.getElementById('upiDetails');
    if (paymentMethodRadios && cardDetails && upiDetails) {
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'card') {
                    cardDetails.style.display = '';
                    upiDetails.style.display = 'none';
                } else {
                    cardDetails.style.display = 'none';
                    upiDetails.style.display = '';
                }
            });
        });
    }
});

// Claim process stub
window.startClaimProcess = function() {
    alert('Claim process coming soon! Required documents and verification will be shown here.');
};

function showDocumentsAccordion(policyType) {
    const docs = requiredDocuments[policyType] || [];
    const accordion = document.getElementById('documentsAccordion');
    accordion.innerHTML = '';
    docs.forEach((doc, idx) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        let inputField = '';
        // For car-specific fields, use text input for model/company/colour, file for picture, file for registration
        if (doc === 'Car Model' || doc === 'Company Name' || doc === 'Car Colour') {
            inputField = `<input type="text" name="doc_${idx}" placeholder="Enter ${doc}" required>`;
        } else if (doc === 'Car Picture') {
            inputField = `<input type="file" name="doc_${idx}" accept=".jpg,.jpeg,.png" required>`;
        } else if (doc === 'Car Registration' || doc === 'RC Book') {
            inputField = `<input type="file" name="doc_${idx}" accept=".pdf,.jpg,.jpeg,.png" required>`;
        } else {
            inputField = `<input type="file" name="doc_${idx}" accept=".pdf,.jpg,.jpeg,.png" required>`;
        }
        item.innerHTML = `
            <div class="accordion-header" onclick="toggleAccordionContent(this)">
                <span>${doc}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="accordion-content">
                <label>${doc.includes('Car') && doc !== 'Car Picture' ? `Enter/Upload ${doc}:` : `Upload ${doc}:`}</label>
                ${inputField}
            </div>
        `;
        accordion.appendChild(item);
    });
}

// Accordion toggle
window.toggleAccordionContent = function(header) {
    header.classList.toggle('active');
    const content = header.nextElementSibling;
    content.classList.toggle('active');
};

// ==================== DOCUMENT & VERIFICATION FUNCTIONS ====================
function openDocumentModal() {
    document.getElementById('documentModal').classList.add('active');
    populatePoliciesForDocument();
}

function closeDocumentModal() {
    document.getElementById('documentModal').classList.remove('active');
    document.getElementById('documentForm').reset();
}

function populatePoliciesForDocument() {
    const policySelect = document.getElementById('policySelect');
    policySelect.innerHTML = '<option value="">Select Policy (Optional)</option>';
    
    if (allPolicies && allPolicies.length > 0) {
        allPolicies.forEach(policy => {
            const option = document.createElement('option');
            option.value = policy.id;
            option.textContent = `${policy.policy_name} (${policy.policy_type})`;
            policySelect.appendChild(option);
        });
    }
}
    function updateDashboard() {
        if (currentUser) {
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('profileImg').src = generateAvatar(currentUser.name);

            // Membership status by highest monthly payment among all policies
            let maxMonthly = 0;
            let membership = 'Normal';
            if (Array.isArray(allPolicies) && allPolicies.length > 0) {
                allPolicies.forEach(p => {
                    if (p.monthly_payment && p.monthly_payment > maxMonthly) {
                        maxMonthly = p.monthly_payment;
                    }
                });
                if (maxMonthly > 5000) {
                    membership = 'Diamond';
                } else if (maxMonthly > 2000) {
                    membership = 'Gold';
                }
            }
            const statusBadge = document.getElementById('statusBadge');
            statusBadge.textContent = membership + ' Member';
            statusBadge.className = 'badge badge-' + membership.toLowerCase();
        }
    }

async function handleDocumentUpload(e) {
    e.preventDefault();

    const documentType = document.getElementById('docType').value;
    const policyId = document.getElementById('policySelect').value;
    const docFile = document.getElementById('docFile').files[0];

    if (!documentType) {
        alert('Please select a document type');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/documents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                documentType: documentType,
                policyId: policyId || null
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Document uploaded successfully! Verification pending.');
            closeDocumentModal();
            loadVerificationStatus();
        } else {
            alert('Failed to upload document: ' + (data.message || 'Please try again'));
        }
    } catch (error) {
        console.error('Document upload error:', error);
        alert('Error uploading document. Please check your connection.');
    }
}

function openVerificationModal() {
    document.getElementById('verificationModal').classList.add('active');
    loadVerificationStatus();
}

function closeVerificationModal() {
    document.getElementById('verificationModal').classList.remove('active');
}

async function loadVerificationStatus() {
    try {
        const response = await fetch(`${API_URL}/documents/verification/status`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayVerificationStatus(data);
        }
    } catch (error) {
        console.error('Error loading verification status:', error);
    }
}

function displayVerificationStatus(data) {
    const verificationContent = document.getElementById('verificationContent');
    
    let html = `
        <div class="user-verification">
            <h3>KYC Status: <strong class="status-badge status-${data.overall_status.toLowerCase()}">${data.overall_status}</strong></h3>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${data.user.name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${data.user.email}</p>
        </div>
        <h4 style="margin-top: 20px;">Documents Submitted:</h4>
        <div class="documents-list">
    `;

    if (data.documents && data.documents.length > 0) {
        data.documents.forEach(doc => {
            html += `
                <div class="document-item">
                    <div class="doc-info">
                        <span class="doc-type">${doc.document_type}</span>
                        <span class="doc-status status-${doc.verification_status.toLowerCase()}">${doc.verification_status}</span>
                    </div>
                    <small>${new Date(doc.uploaded_at).toLocaleDateString('en-IN')}</small>
                </div>
            `;
        });
    } else {
        html += '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No documents uploaded yet</p>';
    }

    html += '</div>';
    verificationContent.innerHTML = html;
}

// ==================== QUICK ACTIONS ====================
function downloadStatement() {
    alert('Statement download functionality coming soon!');
}

function openCalculator() {
    const sumAssured = prompt('Enter Sum Assured amount:', '100000');
    if (sumAssured) {
        // Simple premium calculation: 1% of sum assured
        const calculatedPremium = (sumAssured * 0.01).toFixed(2);
        alert(`Estimated Annual Premium: ₹${parseFloat(calculatedPremium).toLocaleString('en-IN', {minimumFractionDigits: 2})}`);
    }
}

function contactAgent() {
    alert('Contact details:\n\nEmail: support@insurehub.com\nPhone: 1-800-INSURE-1\nAvailable 24/7');
}

// ==================== NAVIGATION ====================
function navigateTo(section, event) {
    event.preventDefault();

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Handle section navigation
    switch(section) {
        case 'home':
            alert('Home section - Dashboard');
            break;
        case 'services':
            alert('Services section - Available services coming soon!');
            break;
        case 'history':
            viewPaymentHistory();
            break;
        case 'help':
            alert('Help & Support\n\nEmail: support@insurehub.com\nPhone: 1-800-INSURE-1\nWebsite: www.insurehub.com');
            break;
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
>>>>>>> d9c3d0f (Updated new details in project)
