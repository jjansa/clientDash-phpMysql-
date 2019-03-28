document.addEventListener("DOMContentLoaded", function(){
var oldURL = document.referrer,
    fields =  document.querySelectorAll('input.form-control'),
    re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8}$/,
    msg = document.createElement('small'),
    emptyField = 'Password is required!',
    badValue = 'Password must be 8 characters exactly, and must include an upper case letter, lower case letter and number.',
    match = 'Passwords must match.',
    passValid = true,
    spinner = $('#nb-global-spinner');
    msg.classList = 'form-text error';

  function validatefields(x){
   Array.prototype.forEach.call(x, function(field) {
     if (field.value != '' || /\S/.test(field.value) != false) {
       if((re.test(field.value))){
         if(fields[0].value == fields[1].value){
           passValid = true;
            $('small.form-text.error').remove();
           $(field).removeClass('form-control-danger');
           $(field).removeClass('form-control-warning');
           $(field).addClass('form-control-success');
           $('.btn-block').prop('disabled', false);
        }else{
             passValid = false;
             if(!$(field).hasClass('form-control-warning')){
               $(field).addClass('form-control-warning');
             }
             $('small.form-text.error').remove();
            $('.btn-block').prop('disabled', true);
             msg.innerText = match;
             $(field).parent().append(msg);
           }
      }else {
          passValid = false;
          $('small.form-text.error').remove();
          $('.btn-block').prop('disabled', true);
          $(field).addClass('form-control-warning');
          msg.innerText = badValue;
          $(field).parent().append(msg);
          }
      }else {
        passValid = false;
        $('small.form-text.error').remove();
        $('.btn-block').prop('disabled', true);
        $(field).addClass('form-control-danger');
        msg.innerText = emptyField;
        $(field).parent().append(msg);
          }
    });
  }

  function keyValidate(){
    Array.prototype.forEach.call(fields, function(field) {
      field.addEventListener('keyup', function(){
        validatefields(fields);
      });
    });
  }
  keyValidate(fields);

//Send form to update
  $('form').on("submit", function(e){
    e.preventDefault();
    spinner.removeClass('hide');
    var repass = $("input[name='rePass']").val(),
        action = $(this).attr("action"),
        formData = {};
        formData.password = repass;
    if(passValid != false ) {
      $.ajax({
        type: "POST",
        url: action,
        data: formData,
        beforeSend: function( xhr ) { spinner.removeClass('hide');},
        error: function(response){
          spinner.addClass("hide");
        if(response.status == 404) {
            swal("Service is not available at the moment.", ' Please check your internet connection or try again later.', "error")
          }
        },
    }).done(function(response){
        spinner.addClass("hide");
        if(response == 'success') {
        // Add success class to form
          swal({title: "Your Changes have been made.", text: "Thanks!", type: "success"}, function(){
            window.location.href = '../login.php';
          });
        }else{
          // Add error class to form
          swal("Something went wrong...", "We're working on it!", "error");
          $("#content").load(location.href+" #content>*","");
        }
      });
    }
  });
}); jQuery();
///^[a-zA-Z0-9-_]+$/;
