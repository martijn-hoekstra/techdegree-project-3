// Global variables
const colors = $('#color').children();
let grandTotal = 0;

$('#payment option:contains("Credit Card")').prop('selected',true);
$('#paypal, #bitcoin').hide();

$('.activities').append('<div class="grandTotal"></div>');


// Job role
$('#other-title').hide();
$('#title').on('change', e => {
  if($(e.target).val() === 'other') {
    $('#other-title').show();
  } else {
    $('#other-title').hide();
  }
}); // end event listener

// Validate data and add or remove 'invalid' class to elements
const validate = (regex, element) => {
  if(regex.test(element.val())) {
    if(element.hasClass('invalid')) {
      element.removeClass('invalid');
    }
  } else {
    if(!(element.hasClass('invalid'))) {
      element.addClass('invalid');
    }
  }
}; // end function

// T-shirt info
$('#design').on('change', e => {
  $('#color').empty();

  if($(e.target).val() === 'js puns') {
    colors.each(function(){
      if($(this).val() === 'cornflowerblue' || $(this).val() === 'darkslategrey' || $(this).val() === 'gold'){
        $('#color').append($(this));
      }
    });
  } else if($(e.target).val() === 'heart js') {
    colors.each(function(){
      if($(this).val() === 'tomato' || $(this).val() === 'steelblue' || $(this).val() === 'dimgrey'){
        $('#color').append($(this));
      }
    });
  } else {
    $('#color').append(colors);
  }
}); // end event listener

// Register for activities
$('.activities').on('change', e => {
  // /^[a-zA-Z\s]*— ?([\w\s-]*), ?\$([\d]+)$/
  const regex = /^([a-zA-Z\s\.]+)\s—\s([\w\s-]+),\s\$([\d]+)$/;
  const activity = $(e.target).parent().text();
  if($(e.target).is(':checked')){
    console.log(activity.replace(regex, '$2'));
    grandTotal += parseInt(activity.replace(regex, '$3'));
    $('.grandTotal').html(`<p>Total: $${grandTotal}</p>`);
  } else {
    grandTotal -= parseInt(activity.replace(regex, '$3'));
    if(grandTotal > 0) {
      $('.grandTotal').html(`<p>Total: $${grandTotal}</p>`);
    } else {
      $('.grandTotal').html('');
    }
  }
}); // end event listener

// Payment info
$('#payment').on('change', e => {
  if($(e.target).val() === 'paypal') {
    $('#paypal').fadeIn(1000);
    $('#credit-card, #bitcoin').hide();
  } else if($(e.target).val() === 'bitcoin') {
    $('#bitcoin').fadeIn(1000);
    $('#credit-card, #paypal').hide();
  } else if($(e.target).val() === 'credit card') {
    $('#credit-card').fadeIn(1000);
    $('#paypal, #bitcoin').hide();
  } else {
    $('#payment option:contains("Credit Card")').prop('selected',true);
    $('#credit-card').fadeIn(1000);
    $('#paypal, #bitcoin').hide();
  }
}); // end event listener

// Validate form
const validateForm = form => {
  const name = $('#name');
  const mail = $('#mail');
  const creditCardNum = $('#cc-num');
  const zipCode = $('#zip');
  const cvv = $('#cvv');

  validate(/^[a-zA-Z\s]{2,}$/, name);
  validate(/^[^@]+@[^@]+\.[a-z]+$/i, mail);

  // Validate Register for Activities (only one checkbox has to be checked)
  if ($(".activities :checkbox:checked").length > 0) {
    console.log('activities checked');
  }

  // Validate creditcard information
  if($('#payment').val() === 'credit card') {
    validate(/^\d{13,16}$/, creditCardNum);
    validate(/^\d{5}$/, zipCode);
    validate(/^\d{3}$/, cvv);
  }
}; // end function

$('form').on('submit', e => {
  e.preventDefault();
  validateForm();
}); // end event listener
