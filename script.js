$(function () {
  const $formContainer = $('.form-container');
  const $successMessage = $('#successMessage');

  const accounts = {
    Google: [
      { id: 'g1', name: 'Alice Smith', email: 'alice.smith@gmail.com' },
      { id: 'g2', name: 'Bob Johnson', email: 'bob.johnson@gmail.com' },
      { id: 'g3', name: 'Charlie Brown', email: 'charlie.b@gmail.com' }
    ],
    Apple: [
      { id: 'a1', name: 'Diana Prince', email: 'diana.p@icloud.com' },
      { id: 'a2', name: 'Ethan Hunt', email: 'ethan.h@icloud.com' }
    ]
  };

  let currentProvider = '';

  $formContainer.on('submit', '#validationForm', function (e) {
    e.preventDefault();
    if (validateFormFields()) {
      simulateApiCall(() => {
        $formContainer.empty().hide();
        $successMessage.css({
          'display': 'block',
          'opacity': 1,
          'visibility': 'visible'
        });
        $('#successMessage h4').text('Welcome!');
        $('#successMessage p').text('Account created successfully!');
      });
    } else {
      const $firstError = $('.is-invalid').first();
      if ($firstError.length) {
        $('html, body').animate({ scrollTop: $firstError.offset().top - 80 }, 500);
      }
    }
  });

  $formContainer.on('click keypress', '#passwordToggle', function (e) {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      const pwd = $('#password');
      pwd.attr('type', pwd.attr('type') === 'password' ? 'text' : 'password');
    }
  });

  $formContainer.on('focus input', 'input', function () {
    $(this).removeClass('is-invalid is-valid');
    $(this).siblings('.invalid-feedback').text('');
  });

  $formContainer.on('click', '#google-btn', () => displayAccountSelection('Google'));
  $formContainer.on('click', '#apple-btn', () => displayAccountSelection('Apple'));

  $formContainer.on('click', '.account-list-item', function() {
    const selectedAccount = {
      id: $(this).data('accountId'),
      name: $(this).data('accountName'),
      email: $(this).data('accountEmail')
    };
    handleAccountSelection(selectedAccount, currentProvider);
  });

  $formContainer.on('click', '#cancel-login', function() {
    resetFormAndShowMainForm();
  });

  $('#resetForm').on('click', resetFormAndShowMainForm);

  function toggleFormState(isEnabled) {
    $formContainer.find('input, button').prop('disabled', !isEnabled);
    $('.account-list-item').prop('disabled', !isEnabled);
  }

  function simulateApiCall(callback) {
    toggleFormState(false);
    const $submitButton = $formContainer.find('button[type="submit"]');
    $submitButton.html('<span class="spinner-border spinner-border-sm"></span> Submitting...');
    setTimeout(() => {
      toggleFormState(true);
      $submitButton.html('Create account');
      callback();
    }, 1800);
  }

  function displayAccountSelection(provider) {
    currentProvider = provider;
    toggleFormState(false);
    $formContainer.hide();
    $successMessage.hide();

    let accountListHtml = `<div class="account-selection-container">
                            <h3 class="text-white mb-3 text-center">Select your ${provider} account</h3>
                            <ul class="list-group list-group-flush">`;

    accounts[provider].forEach(account => {
      accountListHtml += `<li class="list-group-item account-list-item" data-account-id="${account.id}" data-account-name="${account.name}" data-account-email="${account.email}" style="cursor: pointer; background: rgba(58, 58, 58, 0.8); border: 1px solid rgba(74, 74, 74, 0.6); border-radius: 12px; margin-bottom: 8px; padding: 14px 18px; color: #ffffff;">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">${account.name}</h5>
                                <small>${account.email}</small>
                            </div>
                          </li>`;
    });

    accountListHtml += `</ul>
                        <button type="button" class="btn btn-outline-light mt-4 w-100" id="cancel-login">Cancel</button>
                      </div>`;

    $formContainer.html(accountListHtml).show();
    toggleFormState(true);
  }

  function handleAccountSelection(account, provider) {
    if ($successMessage.length === 0) {
      console.error('Success message div not found in DOM');
      return;
    }
    $formContainer.hide();
    $successMessage.css({
      'display': 'block',
      'opacity': 1,
      'visibility': 'visible'
    });
    $('#successMessage h4').text('Welcome!');
    $('#successMessage p').text(`Successfully logged in as ${account.name} ${account.email} with ${provider}.`);
  }

  function resetFormAndShowMainForm() {
    $successMessage.hide();
    $formContainer.html(`
        <div class="form-header text-center mb-4">
            <h2 class="text-white mb-3">Create an account</h2>
            <p class="text-muted">Already have an account? <a href="#" class="text-white text-decoration-none">Log in</a></p>
        </div>
        <form id="validationForm" novalidate>
            <div class="row mb-3">
                <div class="col-6">
                    <input type="text" class="form-control modern-input" id="firstName" name="firstName" placeholder="First name" required>
                    <div class="invalid-feedback"></div>
                </div>
                <div class="col-6">
                    <input type="text" class="form-control modern-input" id="lastName" name="lastName" placeholder="Last name" required>
                    <div class="invalid-feedback"></div>
                </div>
            </div>
            <div class="mb-3">
                <input type="email" class="form-control modern-input" id="email" name="email" placeholder="Email" required>
                <div class="invalid-feedback"></div>
            </div>
            <div class="mb-3">
                <input type="tel" class="form-control modern-input" id="phone" name="phone" placeholder="Phone number" required>
                <div class="invalid-feedback"></div>
            </div>
            <div class="mb-4 position-relative">
                <input type="password" class="form-control modern-input" id="password" name="password" placeholder="Enter your password" required>
                <button type="button" class="password-toggle" id="passwordToggle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <div class="invalid-feedback"></div>
            </div>
            <div class="mb-4">
                <input type="password" class="form-control modern-input" id="confirmPassword" name="confirmPassword" placeholder="Confirm password" required>
                <div class="invalid-feedback"></div>
            </div>
            <div class="mb-4">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="terms" required>
                    <label class="form-check-label text-muted" for="terms">
                        I agree to the <a href="#" class="text-white text-decoration-none">Terms & Conditions</a>
                    </label>
                    <div class="invalid-feedback"></div>
                </div>
            </div>
            <div class="d-grid mb-4">
                <button type="submit" class="btn btn-primary modern-btn">Create account</button>
            </div>
            <div class="divider mb-4">
                <span class="text-white">Or register with</span>
            </div>
            <div class="row g-3">
                <div class="col-6">
                    <button type="button" class="btn social-btn w-100" id="google-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>
                </div>
                <div class="col-6">
                    <button type="button" class="btn social-btn w-100" id="apple-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        Apple
                    </button>
                </div>
            </div>
        </form>
    `).show();
    toggleFormState(true);
  }

  function validateFormFields() {
    let valid = true;
    const firstName = $('#firstName');
    const lastName = $('#lastName');
    const email = $('#email');
    const phone = $('#phone');
    const password = $('#password');
    const confirmPassword = $('#confirmPassword');
    const terms = $('#terms');

    if (!firstName.val().trim() || firstName.val().trim().length < 2) {
      showError(firstName, 'First name must be at least 2 characters');
      valid = false;
    } else showSuccess(firstName);

    if (!lastName.val().trim() || lastName.val().trim().length < 2) {
      showError(lastName, 'Last name must be at least 2 characters');
      valid = false;
    } else showSuccess(lastName);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (!email.val().trim()) {
      showError(email, 'Email is required');
      valid = false;
    } else if (!emailPattern.test(email.val().trim())) {
      showError(email, 'Invalid email address');
      valid = false;
    } else showSuccess(email);

    const phonePattern = /^[+]?[0-9\s\-().]{7,}$/;
    if (!phone.val().trim()) {
      showError(phone, 'Phone number is required');
      valid = false;
    } else if (!phonePattern.test(phone.val().trim())) {
      showError(phone, 'Invalid phone number');
      valid = false;
    } else showSuccess(phone);

    const passwordVal = password.val();
    if (passwordVal.length < 6) {
      showError(password, 'Password must be at least 6 characters');
      valid = false;
    } else if (!/[A-Z]/.test(passwordVal) || !/\d/.test(passwordVal)) {
      showError(password, 'Password requires uppercase letter and number');
      valid = false;
    } else showSuccess(password);

    if (confirmPassword.val() !== passwordVal) {
      showError(confirmPassword, 'Passwords do not match');
      valid = false;
    } else {
      if (confirmPassword.val()) showSuccess(confirmPassword);
      else confirmPassword.removeClass('is-invalid is-valid');
    }

    if (!terms.is(':checked')) {
      terms.addClass('is-invalid');
      terms.siblings('.invalid-feedback').text('You must accept the Terms & Conditions');
      valid = false;
    } else {
      terms.removeClass('is-invalid').addClass('is-valid');
      terms.siblings('.invalid-feedback').text('');
    }

    return valid;
  }

  function showError($field, message) {
    $field.addClass('is-invalid').removeClass('is-valid');
    $field.siblings('.invalid-feedback').text(message);
  }
  function showSuccess($field) {
    $field.removeClass('is-invalid').addClass('is-valid');
    $field.siblings('.invalid-feedback').text('');
  }

  $successMessage.hide();
  resetFormAndShowMainForm();
});
