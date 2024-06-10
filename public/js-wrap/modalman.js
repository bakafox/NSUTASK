function createFormElement(field) {
    const input = document.createElement('input');
    input.type = field.type;

    if (field.type === 'checkbox') {
        input.checked = !!field.defaultValue;
    }
    else if (field.type === 'number') {
        input.value = field.defaultValue ? field.defaultValue : 0;
    }
    else {
        input.value = field.defaultValue ? field.defaultValue : '';
    }

    if (!field.allowEmpty) { input.required = true; }
    return input;
}

function modalmanForm(message, formData) {
    return new Promise((resolve) => {
        const modalman = document.getElementById('modalman');

        const modalmanTitle = document.getElementById('modalman__title');
        modalmanTitle.innerText = message;

        const modalmanContent = document.getElementById('modalman__content');
        modalmanContent.innerHTML = '';
        formData.forEach((field, index) => {
            const input = createFormElement(field);
            input.name = `field_${index}`;
            
            const text = document.createElement('span');
            text.innerHTML = field.name;
            if (!field.allowEmpty) {
                text.innerHTML += '<b style="color: red;">*</b>';
            }

            const label = document.createElement('label');
            if (field.type === 'checkbox') {
                label.appendChild(input);
                label.appendChild(text);
            }
            else {
                label.appendChild(text);
                label.appendChild(input);
            }

            modalmanContent.appendChild(label);
        });
        modalman.showModal();

        document.getElementById('modalman__send').onclick = () => {
            const results = [];
            let valid = true;

            formData.forEach((field, index) => {
                const input = document.querySelector(`[name=field_${index}]`);
                if (!input.checkValidity()) {
                    valid = false;
                    input.reportValidity();
                }

                let result = null;
                if (field.type === 'checkbox') {
                    result = input.checked;
                }
                else if (field.type === 'number') {
                    result = parseFloat(input.value);
                }
                else {
                    result = input.value;
                }

                results.push(result);
            });

            if (valid) {
                resolve(results);
                modalman.close();
            }
        };

        document.getElementById('modalman__cancel').onclick = () => {
            resolve(null);
            modalman.close();
        };
    });
}



// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('modalman__test').addEventListener('click', () => {
//         modalmanForm('Please fill out the form', [
//             { name: 'Текст (обязательно)', type: 'text', defaultValue: 'Default text', allowEmpty: false },
//             { name: 'Текст (необязательно)', type: 'text', defaultValue: null, allowEmpty: true },
//             { name: 'Число (обязательно)', type: 'number', defaultValue: null, allowEmpty: false },
//             { name: 'Число (необязательно)', type: 'number', defaultValue: 42, allowEmpty: true },
//             { name: 'Флажок', type: 'checkbox', defaultValue: true, allowEmpty: true },
//             { name: 'Дата (обязательно)', type: 'date', defaultValue: '2023-12-31', allowEmpty: false },
//             { name: 'Дата (необязательно)', type: 'date', defaultValue: null, allowEmpty: true }
//         ])
//         .then((result) => { console.log(result); });
//     });
// });
