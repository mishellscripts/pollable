$('body').hide().fadeIn('fast');

$(document).ready(function() {
    $('#poll-new-title').focus();
    
    $('.btn-new').click(function(){
        var link = $(this).attr('href');
        $('body').fadeOut('fast', function(){
            window.location.href = '/poll/new';
        });
        return false;
    });    
    $('.btn-view').click(function(){
        var link = $(this).attr('href');
        $('body').fadeOut('fast', function(){
            window.location.href = '/profile';
        });
        return false;
    });
    $('.home').click(function(){
        var link = $(this).attr('href');
        $('body').fadeOut('fast', function(){
            window.location.href = '/';
        });
        return false;
    });
    $('.logout').click(function(){
        var link = $(this).attr('href');
        $('body').fadeOut('fast', function(){
            window.location.href = '/logout';
        });
        return false;
    });
    $('.login').click(function(){
        var link = $(this).attr('href');
        $('body').fadeOut('fast', function(){
            window.location.href = '/login';
        });
        return false;
    });
    
    $('.btn-small-add').click(function(){
        // Max is 5 choices
        var choices = Number.parseInt($('#poll-choices').attr('choices'));
        if (choices < 5) {
            $('#poll-choices').append('<input type="text" name="choice" class="form-control poll-new-option" placeholder="Answer choice">');
            $('#poll-choices').attr('choices', choices+1);
            //console.log($('#poll-choices').attr('choices'));
        }
        else {
            //alert($('#poll-choices').attr('choices'));
            // Display error
        }
    });
    
    $("input[name='data-choice']").click(function(){
        var chosen = $("input[name='data-choice']:checked").val();
        $('#data-display').val(chosen);
    });
})