// const slideArea = document.querySelector('.slide-area');
// const dots = document.querySelectorAll('.dots span');
// dots.forEach((dot) => {
//   dot.addEventListener('click', e => {
//     const index = e.target.getAttribute('data-index');
//     activeIndex = Number(index);
//     dots.forEach((dot) => {
//       dot.classList.remove('active');
//     });
//     e.target.classList.add('active');
//     renderSlider();
//   })
// });
//
// slideArea.addEventListener('mouseenter', e => {
//   // console.log('mouseenter')
//   stopAutoSliding()
// });
//
// slideArea.addEventListener('mouseleave', e => {
//   // console.log('mouseleave')
//   startAutoSliding();
// });

const formValidator = (form, fieldsConfig, onValidateSuccess, onValidationError) => {

  const validateField = (fieldElement, fieldConfig) => {
    const value = fieldElement.value;
    const rules = fieldConfig.rules;
    const formGroup = fieldElement.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error-message');

    const fieldValidationResult = {name: fieldConfig.name, value: value, errors: []};
    rules.forEach(rule => {
      if (rule.required && !value) {
        fieldValidationResult.errors.push(rule.message);
      }
      if (rule.maxLength && `${value}`.length > rule.maxLength) {
        fieldValidationResult.errors.push(rule.message);
      }
      if(rule.type && isNaN(Number(value))){
        fieldValidationResult.errors.push(rule.message);      
      }
      if(rule.length13 && value.startsWith(`+`) && value.length != 13){
        fieldValidationResult.errors.push(rule.message);      
      }
      if(rule.length9 && !value.startsWith(`+`) && value.length != 9){
        fieldValidationResult.errors.push(rule.message);      
      }
    });

    if(fieldValidationResult.errors.length > 0){
      errorElement.innerText = fieldValidationResult.errors.join('\n');
    } else {
      errorElement.innerText = '';
    }

    return fieldValidationResult;
  }

  const validateOnChange = () => {
    fieldsConfig.forEach((fieldConfig) => {
      const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
      fieldElement.addEventListener('input', e => {
        validateField(e.target, fieldConfig);
      });
    })
  }

  const validateOnSubmit = () => {
    const validatedFields = [];
    fieldsConfig.forEach((fieldConfig) => {
      const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
      validatedFields.push(validateField(fieldElement, fieldConfig));
    });

    return validatedFields;
  }

  const listenFormSubmit = () => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      console.log('submit');
      const errors = [];
      const validationResult = validateOnSubmit();
      validationResult.forEach(result => {
        errors.push(...result.errors);
      });
      if(errors.length === 0){
        onValidateSuccess(validationResult);
      }else {
        onValidationError(validationResult);
      }
      console.log(validationResult);
    });
  }
  listenFormSubmit();
  validateOnChange();
}

const fieldsConfig = [
  {
    name: 'first_name',
    rules: [
      {required: true, message: 'First name is required.'},
      {maxLength: 10, message: 'სიბოლოების რაოდენობა უნდა იყოს 10 ზე ნაკლები ან ტოლი'},
    ]
  },
  {
    name: 'last_name',
    rules: [
      {required: true, message: 'Last name is required.'},
    ]
  },
  {
    name: 'zip_code',
    rules: [
      {required: true, message: 'Zip Code name is required.'},
    ]
  },
  {
    name: `personal_number`,
    rules: [
      {required:true, message: `Personal number is required`},
      {maxLength:11,  message: `სიმბოლოების რაოდენობა უნდა იყოს 11ზე ნაკლები ან ტოლი`},
      {type:`number`, message: `გთხოვთ შეიყვანოთ მხოლოდ რიცხვები`}
    ]
  },
  {
    name: `mobile_number`,
    rules: [
      {required:true, message: `Mobile number is required`},
      {length9:9,  message: `სიმბოლოების რაოდენობა უნდა იყოს 9-ის ტოლი`},
      {length13:13,  message: `+-ით დაწყებული ნომრის სიმბოლოების რაოდენობა უნდა იყოს 13-ის ტოლი`},
      {type:`number`, message: `გთხოვთ შეიყვანოთ მხოლოდ რიცხვები`}
    ]
  },
];


const form = document.querySelector('#user-registraion-form');

const onFormSubmitSuccess = (fields) => {
  console.log('We can send data to server', fields);
}
const onFormSubmitError = (fields) => {
  console.log('Error', fields);
}

formValidator(form, fieldsConfig, onFormSubmitSuccess, onFormSubmitError);
