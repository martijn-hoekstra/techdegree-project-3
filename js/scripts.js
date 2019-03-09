// Global variables
const colors = $('#color').children();
$('#payment option:contains("Credit Card")').prop('selected',true);
$('#paypal, #bitcoin').hide();

// Job role
$('#other-title').hide();
$('#title').on('change', e => {
  if($(e.target).val() === 'other') {
    $('#other-title').show();
  } else {
    $('#other-title').hide();
  }
});

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
});

// Register for activities


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
});

// Validate form
const validateForm = form => {
  const name = $('#name');
  const mail = $('#mail');
  const creditCardNum = $('#cc-num');
  const zipCode = $('#zip');
  const cvv = $('#cvv');

  // Validate Name
  console.log(/^[a-zA-Z\s]{2,}$/.test(name.val()));

  // Validate Email
  console.log(/^[^@]+@[^@]+\.[a-z]+$/i.test(mail.val()));
  // Validate Register for Activities (only one checkbox has to be checked)
  colors.each(function() {

  });
};

$('form').on('submit', e => {
  e.preventDefault();
  validateForm();
});
