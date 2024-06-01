(function ($) {
  'use strict';

  // Preloader js    
  $(window).on('load', function () {
    $('.preloader').fadeOut(100);
  });

  $('.main-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 6000,
    prevArrow: '<div class="slick-control-prev"><i class="ti-arrow-left"></i></div>',
    nextArrow: '<div class="slick-control-next"><i class="ti-arrow-right"></i></div>'
  });


  // Count Down JS
  var Year = $('#simple-timer').attr('data-year');
  var Month = $('#simple-timer').attr('data-month');
  var Day = $('#simple-timer').attr('data-day');
  var Hour = $('#simple-timer').attr('data-hour');
  $('#simple-timer').syotimer({
    year: Year,
    month: Month,
    day: Day,
    hour: Hour,
    minute: 0
  });

  // overlay search
  $('.search_toggle').on('click', function (e) {
    e.preventDefault();
    $('.search_toggle').toggleClass('active');
    $('.overlay').toggleClass('open');
    setTimeout(function () {
      $('.search-form .form-control').focus();
    }, 400);
  });

  // product Slider
  $('.single-product-slider').slick({
    autoplay: false,
    infinite: true,
    arrows: false,
    dots: true,
    customPaging: function (slider, i) {
      var image = $(slider.$slides[i]).data('image');
      return '<img class="img-fluid" src="' + image + '" alt="product-img">';
    }
  });


  // instafeed
  if (($('#instafeed').length) !== 0) {
    var accessToken = $('#instafeed').attr('data-accessToken');
    var userFeed = new Instafeed({
      get: 'user',
      resolution: 'low_resolution',
      accessToken: accessToken,
      limit: 6,
      template: '<div class="col-lg-2 col-md-3 col-sm-4 col-6 px-0 mb-4"><div class="instagram-post mx-2"><img class="img-fluid w-100" src="{{image}}" alt="instagram-image"><ul class="list-inline text-center"><li class="list-inline-item"><a href="{{link}}" target="_blank" class="text-white"><i class="ti-heart mr-2"></i>{{likes}}</a></li><li class="list-inline-item"><a href="{{link}}" target="_blank" class="text-white"><i class="ti-comments mr-2"></i>{{comments}}</a></li></ul></div></div>'
    });
    userFeed.run();
  }


  // Заменяемый элемент
  var element = document.getElementById('navbar');

  // Обработчик события прокрутки
  window.addEventListener('scroll', function() {
    // Проверяем, сколько прокручено вверх от верхней части страницы
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    // Задаем пороговое значение для замены класса
    var scrollThreshold = 200;

    // Если прокрутка превысила пороговое значение, меняем класс элемента
    if (scrollTop > scrollThreshold) {
      element.classList.remove('sticky-top');
      element.classList.add('fixed-top');
    } else {
      element.classList.remove('fixed-top');
      element.classList.add('sticky-top');
    }
  });


})(jQuery);



// form validate
var form = document.querySelector('.needs-validation');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phone');

if (form) {
  form.addEventListener('submit', function(event) {
    if (!validateName() || !validateEmail() || !validatePhone()) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add('was-validated');
  });
}

function validateName() {
  var value = nameInput.value.trim();

  if (value === '') {
    nameInput.classList.add('is-invalid');
    return false;
  } else {
    nameInput.classList.remove('is-invalid');
    return true;
  }
}

function validateEmail() {
  var value = emailInput.value.trim();
  var emailRegex = /^\S+@\S+\.\S+$/;

  if (value === '' || !emailRegex.test(value)) {
    emailInput.classList.add('is-invalid');
    return false;
  } else {
    emailInput.classList.remove('is-invalid');
    return true;
  }
}

$(document).ready(function() {
  $('#phone').inputmask('+7 (999) 999-99-99');
});

function validatePhone() {
  var value = phoneInput.value;

  if (value === '') {
    phoneInput.classList.add('is-invalid');
    return false;
  } else {
    phoneInput.classList.remove('is-invalid');
    return true;
  }
}