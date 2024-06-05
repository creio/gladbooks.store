function capitalizeFirstLetter(mystring) {
    return mystring.charAt(0).toUpperCase() + mystring.slice(1);
}
function stripHtml(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function updateBuyButton(el) {
    
    // assumes el is a <select> with 
    // <option data-variantname="" data-price=""></option>
    
    // assumes el is part of a form where the submit button (input[type="submit"]) looks like 
    // <input type="submit" data-url="" data-sku="" data-title="" data-varianttype="" data-variantname="" data-price="" data-image="" value="Add to cart" />

    el.closest('form').querySelector('button[type=\'submit\']').setAttribute('data-sku',el.options[el.selectedIndex].getAttribute('data-sku'));
    el.closest('form').querySelector('button[type=\'submit\']').setAttribute('data-variantname',el.options[el.selectedIndex].getAttribute('data-variantname'));
    el.closest('form').querySelector('button[type=\'submit\']').setAttribute('data-price',el.options[el.selectedIndex].getAttribute('data-price'));
    el.closest('form').querySelector('button[type=\'submit\']').setAttribute('data-item-price',el.options[el.selectedIndex].getAttribute('data-item-price'));

    updateProductPrice(el.closest('form').querySelector('button[type=\'submit\']').getAttribute('data-price'));

    var cart = JSON.parse(localStorage.getItem("cart"));
    var i;
    var product_url = window.location.pathname;
    // console.log(product_url);

    if (cart !== null && cart.length) {
        var button = document.querySelector('.products-meta button[type=\'submit\']');
        var foundValue = cart.find(item => item.sku === button.getAttribute('data-sku'));

        for (i = 0; i < cart.length; ++i) {
          if (product_url == cart[i].url &&
              foundValue !== undefined) {

            button.disabled = true;
            button.textContent = 'Уже в корзине';
          } else {
            button.disabled = false;
            button.textContent = 'В корзину';
          }
        }
    }
}

function updateProductPrice(price) {
    
    // assumes prices look like 
    // <span class="productprice">20</span>

    var elements = document.querySelectorAll('.productprice'), i;
    for (i = 0; i < elements.length; ++i) {
        elements[i].innerHTML = parseFloat(price).toFixed(2);
    }
}

function updateCartCount() {
    
    // assumes itemcount look like 
    // <span class="itemcount">0</span>

    if(localStorage.getItem("cart")) {
        var cart = JSON.parse(localStorage.getItem("cart"));
        var itemcount = 0;
        for (i = 0; i < cart.length; ++i) {
            itemcount += cart[i].quantity;
        }

        var elements = document.querySelectorAll('.itemcount'), i;
        for (i = 0; i < elements.length; ++i) {
            elements[i].innerHTML = itemcount;
            if(itemcount == 0) elements[i].style.display = 'none';
            else elements[i].style.display = 'initial';
        }
    }
}

function addToCart(el) {

    // assumes execution onsubmit of a form where el is the form and the submit button (input[type="submit"]) looks like 
    // <input type="submit" data-url="" data-sku="" data-title="" data-varianttype="" data-variantname="" data-price="" data-image="" value="Add to cart" />

    if (localStorage.getItem("cart")) var cart = JSON.parse(localStorage.getItem("cart"));
    else var cart = new Array();

    // increment quantity when sku exists
    var found = false;

    /*var i;
    for (i = 0; i < cart.length; ++i) {
        if(cart[i].sku == el.querySelector('button[type=\'submit\']').getAttribute('data-sku')) {
            found = true;
            cart[i].quantity = cart[i].quantity + 1;
        }
    }*/

    // add to cart array when sku does not exist
    if(!found) {
        var newitem = {
            url: el.querySelector('button[type=\'submit\']').getAttribute('data-url'),
            sku: el.querySelector('button[type=\'submit\']').getAttribute('data-sku'),
            title: el.querySelector('button[type=\'submit\']').getAttribute('data-title'),
            cloudfilename: el.querySelector('button[type=\'submit\']').getAttribute('data-cloudfilename'),
            formats: el.querySelector('button[type=\'submit\']').getAttribute('data-formats'),
            varianttype: el.querySelector('button[type=\'submit\']').getAttribute('data-varianttype'),
            variantname: el.querySelector('button[type=\'submit\']').getAttribute('data-variantname'),
            price: el.querySelector('button[type=\'submit\']').getAttribute('data-price'),
            image: el.querySelector('button[type=\'submit\']').getAttribute('data-image'),
            quantity: 1
        };
        cart.push(newitem);
    }
    // store cart array
    localStorage.setItem("cart", JSON.stringify(cart));
    
    updateCartCount();
    
    return true;
}

function populateCart() {
    var cart = JSON.parse(localStorage.getItem("cart")), i;
    var carttotal = 0;

    document.getElementById('shoppingcart').querySelector('tbody').innerHTML = '<tr><td colspan="6" style="text-align: center;">Ваша корзина пуста.</td></tr>';

    if(cart && cart.length) {
        document.getElementById('shoppingcart').querySelector('tbody').innerHTML = '';
        for (i = 0; i < cart.length; ++i) {
            var newline = '<tr><td class="productavatar"><a href="'+cart[i].url+'" title="'+cart[i].title+'"><img class="" src="'+cart[i].image+'" alt="'+cart[i].title+'"></a></td><td><a class="" href="'+cart[i].url+'">'+cart[i].title+'</a>';
            // var newline = '<tr><td class="productavatar"><a href="'+cart[i].url+'" title="'+cart[i].sku+'"><img class="" src="'+cart[i].image+'" alt="'+cart[i].sku+'"></a></td><td><a class="" href="'+cart[i].url+'">'+cart[i].title+'</a>';
            if(cart[i].varianttype && cart[i].variantname) newline += '<br />'+capitalizeFirstLetter(cart[i].varianttype)+': '+cart[i].variantname;
            // newline += '<br />'+parseFloat(cart[i].price).toFixed(2)+' ₽</td><td><input class="quantity qty" type="number" value ="'+cart[i].quantity+'" min="0" max="99" onchange="updateQuantity(\''+cart[i].sku+'\',this.value)" /></td><td>'+(cart[i].quantity * cart[i].price).toFixed(2)+' ₽</td><td class="remove"><a href="javascript:removeFromCart(\''+cart[i].sku+'\');">Удалить</a></td></tr>';
            newline += '<br />'+parseFloat(cart[i].price).toFixed(2)+' ₽</td><td>'+(cart[i].quantity * cart[i].price).toFixed(2)+' ₽</td><td class="remove"><a href="javascript:removeFromCart(\''+cart[i].sku+'\');">Удалить</a></td></tr>';
            document.getElementById('shoppingcart').querySelector('tbody').innerHTML += newline;
            carttotal += parseFloat(cart[i].quantity * cart[i].price);
        }
    }

    var elements = document.querySelectorAll('.carttotal'), i;
    for (i = 0; i < elements.length; ++i) {
        elements[i].innerHTML = carttotal.toFixed(2);
    }

    updateCartCount();
}

function removeFromCart(sku) {
    
    var cart = JSON.parse(localStorage.getItem("cart")), i;
    for (i = 0; i < cart.length; ++i) {
        if(cart[i].sku == sku) {
            cart.splice(i, 1);
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    populateCart();
}

function updateQuantity(sku,quantity) {
    
    var cart = JSON.parse(localStorage.getItem("cart")), i;
    for (i = 0; i < cart.length; ++i) {
        if(cart[i].sku == sku) {
            cart[i].quantity = parseInt(quantity);
            if(parseInt(quantity) == 0 ) {
                removeFromCart(sku);
                return;
            }
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    
    populateCart();
}

function setAddons(el) {

    // assumes execution onchange of a form where el is the form

    // fill addons array
    var addons = new Array();
    var inputs = el.querySelectorAll("input, select");
    for (i=0; i<inputs.length; i++){
        if(inputs[i].getAttribute('data-price') && inputs[i].checked) {
            var newitem = {
                title: inputs[i].getAttribute('data-title'),
                price: inputs[i].getAttribute('data-price')
            }
            addons.push(newitem);
        }
        if(inputs[i].tagName == 'SELECT') {
            if(inputs[i].value && inputs[i].options[inputs[i].selectedIndex].getAttribute('data-price')) {
                var newitem = {
                    title: inputs[i].options[inputs[i].selectedIndex].getAttribute('data-title'),
                    price: inputs[i].options[inputs[i].selectedIndex].getAttribute('data-price')
                }
                addons.push(newitem);
            }
        }
    }

    // store addons array
    localStorage.setItem("addons", JSON.stringify(addons));
    
    // update checkoutcalculation div
    var carttotal = getCartTotal();
    var addontotal = getAddonTotal();
    var newline = '<span>Корзина: </span> '+parseFloat(carttotal).toFixed(2)+' ₽';
    for (i=0; i<addons.length; i++){
        newline += '\n<br /><span>'+addons[i].title+': </span>'+parseFloat(addons[i].price).toFixed(2)+' ₽';
    }
    if(addons.length) newline += '\n<div class="sum"><span>Общая сумма платежа: </span>'+parseFloat(carttotal + addontotal).toFixed(2)+' ₽</div>';
    document.getElementById('checkoutcalculation').innerHTML = newline;

    // write this value to the hidden checkout input (for the form)
    el.querySelector('input[name="checkout"]').value = stripHtml(newline).replace(/(?:\r\n|\r|\n)/g, ' | ');

}

function setOrderNumber(el) {

  // assumes execution on the onclick handler of the submit button of a form where el is the form
  // ordernumber is the current date in tenths of a second (current date in milliseconds divided by 100) modulo 60*60*24*365*30*10 (30 years in thenth of a seconds)

  var ordernumber = Math.round(new Date().getTime() / 100) % 6307200000;
  el.querySelector('input[name=\'ordernumber\']').value = ordernumber;
  localStorage.setItem('ordernumber', ordernumber);

  // Создаем массив для хранения данных формы
  var formData = [];

  // Получаем данные из полей формы
  var nameInput = el.querySelector('input[name=\'name\']').value;
  var emailInput = el.querySelector('input[name=\'email\']').value;
  var phoneInput = el.querySelector('input[name=\'phone\']').value;
  var productsInput = el.querySelector('input[name=\'products\']').value;
  var priceInput = el.querySelector('input[name=\'price\']').value;

  // Создаем объект с ключ-значение парами и добавляем его в массив formData
  var dataObj = {
    name: nameInput,
    email: emailInput,
    phone: phoneInput,
    products: productsInput,
    price: priceInput
  };

  formData.push(dataObj);
  localStorage.setItem('formData', JSON.stringify(formData));
}

function initCheckoutForm(el) {

    var cart = JSON.parse(localStorage.getItem("cart")), i;

    // add order input (hidden)
    var newinput = document.createElement("input");
    newinput.setAttribute('type',"hidden");
    newinput.setAttribute('name',"order");
    for (i = 0; i < cart.length; ++i) {
        var productdescription = cart[i].quantity+' x '+cart[i].title;
        if(cart[i].varianttype && cart[i].variantname) productdescription += ' ('+capitalizeFirstLetter(cart[i].varianttype)+': '+cart[i].variantname+')';
        productdescription += ' = '+parseFloat(cart[i].quantity * cart[i].price).toFixed(2)+' ₽';
        if(i) newinput.setAttribute('value',newinput.getAttribute('value') + ' | ' + productdescription);
        else newinput.setAttribute('value',productdescription);
    }
    el.appendChild(newinput);

    // add empty checkout input (hidden)
    var newinput = document.createElement("input");
    newinput.setAttribute('type',"hidden");
    newinput.setAttribute('name',"checkout");
    el.appendChild(newinput);
    setAddons(el);

    // add empty products input (hidden)
    var newinput = document.createElement("input");
    newinput.setAttribute('type',"hidden");
    newinput.setAttribute('name',"products");
    newinput.setAttribute('id',"products");
    var products = '';
    for (var i = 0; i < cart.length; i++) {
      var products = cart[i].title + '(' +cart[i].variantname+ ')' + ' ' +parseFloat(cart[i].price).toFixed(2)+' ₽';
      if(i) newinput.setAttribute('value',newinput.getAttribute('value') + ' | ' + products);
      else newinput.setAttribute('value',products);
    }
    el.appendChild(newinput);

    // add empty price input (hidden)
    var newinput = document.createElement("input");
    newinput.setAttribute('type',"hidden");
    newinput.setAttribute('name',"price");
    newinput.setAttribute('id',"price");
    var price = 0;
    for (var i = 0; i < cart.length; i++) {
      price += parseFloat(cart[i].quantity * cart[i].price); // Удалите вызов метода toFixed(2) внутри parseFloat
    }

    if (cart.length === 0) {
      newinput.setAttribute('value', '');
    } else {
      newinput.setAttribute('value', price.toFixed(2));
    }
    el.appendChild(newinput);
}

function getCartTotal() {
    
    // sum of prices in the cart

    var cart = JSON.parse(localStorage.getItem("cart"));
    var i;
    var carttotal = 0;

    if (cart !== null && cart.length) {
        for (i = 0; i < cart.length; ++i) {
            carttotal += parseFloat(cart[i].quantity * cart[i].price);
        }
    }
    return carttotal;
}

function getAddonTotal() {
    
    // sum of prices in the addons

    var i;
    var addontotal = 0;
    var addons = JSON.parse(localStorage.getItem("addons")), i;
    if (addons !== null && addons.length) {
      for (i=0; i<addons.length; i++){
          addontotal = addontotal + parseFloat(addons[i].price);
      }
    }
    return addontotal;
}

function redirectToPayment(paymentlink) {

    // is used on the paylink page/layout

    var checkoutcalculation = getCartTotal() + getAddonTotal();
    var ordernumber = localStorage.getItem('ordernumber');
    document.location.href = paymentlink+'/'+checkoutcalculation+'/Order%20number%20'+ordernumber;
}


// init functions
// if(document.getElementById('variant')) updateBuyButton(document.getElementById('variant'));
if(document.getElementById('shoppingcart')) populateCart();
if(document.getElementById('checkout')) {
    var form = document.getElementById('checkout').querySelector('form');
    initCheckoutForm(form);
    //populateMiniCart();
    form.onchange({target: form});
}

updateCartCount();


var carttotal = getCartTotal();
var addontotal = getAddonTotal();
var paymenttotal = parseFloat(carttotal + addontotal).toFixed(2);
if(document.getElementById('paymenttotal')) document.getElementById('paymenttotal').innerHTML  = paymenttotal;



/* send mail */
function mailerSend (payment_id, dataStorage) {
  var formatObject = dataStorage;
  formatObject.payment_id = payment_id;
  var formData = JSON.parse(localStorage.getItem("formData"));
  formatObject.username = formData[0].name;
  formatObject.email = formData[0].email;
  formatObject.phone = formData[0].phone;

  // console.log(formatObject);

  // Отправка AJAX-запроса на PHP-обработчик с использованием jQuery
  $.ajax({
    url: 'https://gladbooks.ru/backend/mailer.php',
    type: 'POST',
    data: { formatObject: JSON.stringify(formatObject) },
    success: function(response) {
      console.log(response);

      // Обработка ошибки
      if (response.error) {
        console.log(response.error);
        // modalError();
      }
    },
    error: function(xhr, status, error) {
      // Обработка ошибки
      console.log(error);
      // modalError();
    }
  });
}
// mailerSend();

/* send mail admin info pay */
function mailerAdmin (payment_id) {
  var formData = JSON.parse(localStorage.getItem("formData"));
  formData[0].payment_id = payment_id;

  // console.log(formData);

  // Отправка AJAX-запроса на PHP-обработчик с использованием jQuery
  $.ajax({
    url: 'https://gladbooks.ru/backend/maileradmin.php',
    type: 'POST',
    data: { dataObject: JSON.stringify(formData) },
    success: function(response) {
      console.log(response);

      // Обработка ошибки
      if (response.error) {
        console.log(response.error);
        // modalError();
      }
    },
    error: function(xhr, status, error) {
      // Обработка ошибки
      console.log(error);
      // modalError();
    }
  });
}
// mailerAdmin('321-123-123-123');


/* send telegram admin info pay */
function tgPay (payment_id) {
  var tgpayData = JSON.parse(localStorage.getItem("formData"));
  tgpayData[0].payment_id = payment_id;

  // console.log(formData);

  // Отправка AJAX-запроса на PHP-обработчик с использованием jQuery
  $.ajax({
    url: 'https://gladbooks.ru/backend/tgpay.php',
    type: 'POST',
    data: { tgpayObject: JSON.stringify(tgpayData) },
    success: function(response) {
      console.log(response);

      // Обработка ошибки
      if (response.error) {
        console.log(response.error);
        // modalError();
      }
    },
    error: function(xhr, status, error) {
      // Обработка ошибки
      console.log(error);
      // modalError();
    }
  });
}
// tgPay('321-123-123-123');


/* cloud storage files */
function cloudStorage (payment_id, callback) {
  var cart = JSON.parse(localStorage.getItem("cart")), i;

  var formatObject = {};

  for (var i = 0; i < cart.length; i++) {
    var key = cart[i].title+ ' (' +cart[i].variantname+ ') '+cart[i].price+ ' ₽';
    var formatArray = cart[i].formats.split(",").map((format) => format.trim());

    var formatFiles = [];
    var formatMp3 = [];

    if (formatArray.includes("mp3")) {
      formatObject[key] = cart[i].cloudfilename + '.mp3';
    }
    formatArray.forEach((format) => {
      if (format !== "mp3") {
        formatFiles.push(cart[i].cloudfilename + '.' + format);
      } else {
        formatMp3.push(cart[i].cloudfilename + '.zip');
      }
    });

    if (cart[i].variantname !== 'mp3') {
      formatObject[key] = formatFiles;
    }
    if (cart[i].variantname === 'mp3') {
      formatObject[key] = formatMp3;
    }
  }

  localStorage.setItem('dataStorage', []);
  localStorage.setItem('dataStorage', JSON.stringify(formatObject));

  // Отправка AJAX-запроса на PHP-обработчик с использованием jQuery
  $.ajax({
    url: 'https://gladbooks.ru/backend/firebase.php',
    type: 'POST',
    data: { formatObject: JSON.stringify(formatObject) },
    success: function(response) {
      var result = response;

      document.querySelector('.pay-modal .pay_id').innerHTML = payment_id;

      var linkContainer = document.createElement('span'); // Создайте элемент-контейнер для всех ссылок
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          var name = result[key].name;
          var urls = result[key].url;

          var title = document.createElement('h6');
          title.classList.add('text-secondary', 'my-3');
          title.textContent = key;
          linkContainer.appendChild(title);

          name.forEach((fileName, index) => {
            var link = document.createElement('a');
            link.href = urls[index];
            link.textContent = fileName;
            link.target = "_blank";

            var listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.appendChild(link);

            linkContainer.appendChild(listItem);
          });
        }
      }
      document.querySelector('.list-group .links-header').insertAdjacentElement('afterend', linkContainer);

      callback(null, result);

      // Обработка ошибки
      if (response.error) {
        console.log(response.error);
        modalError();
      }
    },
    error: function(xhr, status, error) {
      // Обработка ошибки
      console.log(error);
      modalError();
    }
  });
}

function modalError () {
  var modalTitle = document.querySelector('.pay-modal .modal-title');
  modalTitle.innerHTML = 'Ошибка';
  var modalBody = document.querySelector('.pay-modal .modal-body');
  modalBody.innerHTML = '<p>Попробуйте перезагрузить страницу, или отправьте письмо на <a href="mailto:admin@gladbooks.ru">admin@gladbooks.ru</a> с описанием проблемы.</p>';
  var modalFooter = document.querySelector('.pay-modal .modal-footer');
  modalFooter.remove();
}

/* юкасса */
function yooKassa () {
  if (document.getElementById('payment-form')) {
    var ordernumber = localStorage.getItem("ordernumber");
    var paymenttotal = parseFloat(getCartTotal() + getAddonTotal()).toFixed(2);

    if (paymenttotal && paymenttotal !== '0.00') {

      var formData = JSON.parse(localStorage.getItem("formData"));
      var item;

      if (formData !== null && formData.length) {
        for (var item = 0; item < formData.length; item++) {
          var name = formData[item].name;
          var email = formData[item].email;
          var phone = formData[item].phone;
          var products = formData[item].products;
        }
      }

      const requestData = {
        name: name,
        email: email,
        phone: phone,
        products: products,
        price: paymenttotal,
        ordernumber: ordernumber,
      };

      $.ajax({
        url: 'https://gladbooks.ru/backend/yukassa.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(requestData),
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
          if (response.confirmationToken) {
            let confirm_token = response.confirmationToken;
            let payment_id = response.payId;
            setToken(confirm_token, payment_id);
          } else {
            console.log('Ошибка при получении confirmation_token');
          }
        },
        error: function() {
          console.log('Ошибка при выполнении AJAX-запроса');
        }
      });
    } else {
      console.log('paymenttotal не существует или является пустой');
    }
  }
}
yooKassa();

// Инициализация виджета. Все параметры обязательные.
function setToken (confirm_token, payment_id) {
  const checkout = new window.YooMoneyCheckoutWidget({
    confirmation_token: confirm_token,
    // return_url: 'http://localhost:1313/success', // Ссылка на страницу завершения оплаты

    customization: {
      modal: false,
      // Настройка цветовой схемы, минимум один параметр, значения цветов в HEX
      colors: {
        // Цвет акцентных элементов: кнопка Заплатить, выбранные переключатели, опции и текстовые поля
        control_primary: '#fb5c42', // Значение цвета в HEX
        // Цвет платежной формы и ее элементов
        background: '#F2F3F5' // Значение цвета в HEX
      }
    },
    error_callback: function(error) {
      console.log(error);
    }
  });

  checkout.on('success', () => {
    // Код, который нужно выполнить после успешной оплаты.
    // Получение идентификатора платежа после успешной оплаты
    console.log('Идентификатор платежа:', payment_id);

    localStorage.setItem("paymentId", payment_id);

    // получение файлов
    cloudStorage(payment_id, function(error, result) {
      if (error) {
        console.log(error);
      } else {
        // console.log(result);
        // отправка на почту клиента
        mailerSend(payment_id, result);
      }
    });
    // отправка на почту admin
    mailerAdmin(payment_id);
    // отправка в telegram
    tgPay(payment_id);

    localStorage.setItem("cart", "[]");
    localStorage.setItem("addons", "[]");
    localStorage.setItem("ordernumber", "");
    // console.log(JSON.parse(localStorage.getItem("cart")));

    updateCartCount();
    $('#paySuccess').modal('show');

    // Удаление инициализированного виджета
    checkout.destroy();
  });

  checkout.on('fail', () => {
    // Код, который нужно выполнить после неудачной оплаты.

    // Удаление инициализированного виджета
    checkout.destroy();
  });

  // Отображение платежной формы в контейнере
  checkout.render('payment-form');
}
/* / юкасса */


// check cart product
function checkCartProduct() {
    var cart = JSON.parse(localStorage.getItem("cart"));
    var i;
    var product_url = window.location.pathname;

    // console.log(product_url);

    if (cart !== null && cart.length) {
        var button = document.querySelector('.products-meta button');

        for (i = 0; i < cart.length; ++i) {
          if (product_url == cart[i].url &&
              cart[i].sku == button.getAttribute('data-sku')) {

            button.disabled = true;
            button.textContent = 'Уже в корзине';
          }
        }
    }
    // reset product option variant
    window.addEventListener('load', function() {
      if (document.getElementById('variant')) {
        var selectElement = document.getElementById('variant');
        selectElement.selectedIndex = 0; // Сбрасываем выбор
        // selectElement.value = 'defaultOptionValue';
      }
    });
}
if (document.querySelector('.products-meta button')) {
  checkCartProduct();
}


// modals
/*var openModalBtn = document.getElementById('openModalBtn');
var modal = document.getElementById('modal');
var closeBtn = document.getElementsByClassName('close')[0];

openModalBtn.addEventListener('click', function() {
  modal.style.display = 'block';
});

closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});*/