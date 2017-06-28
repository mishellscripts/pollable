$(document).ready(function() {
    
    var fadeAndRedirect = function(btnName, redirect) {
        $(btnName).click(function(){
            window.location.href = redirect;
            $('.page').fadeOut(200);
            return false;
        });    
    }
    
    $( ".loader" ).fadeOut(200, function(){
        $( ".page" ).fadeIn(200);
    });  
    
    $('body').hide().fadeIn('fast');

    $('#poll-new-title').focus();
    
    fadeAndRedirect('.btn-new', '/poll/new');
    fadeAndRedirect('.btn-new', '/poll/new');
    fadeAndRedirect('.btn-view', '/profile');  
    fadeAndRedirect('.home', '/');
    fadeAndRedirect('.login', '/login');
    fadeAndRedirect('.btn-logout', '/logout');
    
    $('.btn-create').click(function() {
        $('.page').fadeOut(200);
    })
    
    $('.btn-small-add').click(function(){
        // Max is 5 choices
        var choices = Number.parseInt($('#poll-choices').attr('choices'));
        if (choices < 5) {
            $('#poll-choices').append('<input type="text" name="choice" class="form-control poll-new-option" placeholder="Answer choice">');
            $('#poll-choices').attr('choices', choices+1);
            //console.log($('#poll-choices').attr('choices'));
        }
        else {
            popupOpenClose($(".popup"));
        }
    });
    
    $('.logout').click(function() {
        popupOpenClose($(".logout-alert"));
    })
    
    $('.btn-delete').click(function() {
        popupOpenClose($(".delete-alert"));
    })
    

    $("input[name='data-choice']").click(function(){
        var chosen = $("input[name='data-choice']:checked").val();
        $('#data-display').val(chosen);
        var checked = $("input[name='data-choice']:checked").next();
        var unchecked = $("input[name='data-choice']:not(:checked)").next();
        checked.addClass('enlarge');
        checked.removeClass('grey-out');
        unchecked.removeClass('enlarge');
        unchecked.addClass('grey-out');
    });
    
    function popupOpenClose(popup) {
    	/* Open popup */
    	$(popup).show();
    
    	/* Close popup if user clicks on background */
    	$(popup).click(function(e) {
    		if ( e.target == this ) {
    			if ($(popup).is(':visible')) {
    				$(popup).hide();
    			}
    		}
    	});
    
    	/* Close popup and remove errors if user clicks on cancel or close buttons */
    	$('.btn-close').click( function() {
    		if ($('.formElementError').is(':visible')) {
    			$('.formElementError').remove();
    		}
    		$(popup).hide();
    	});
    }
    
    $('.btn-share').on('click', function() {
    	popupOpenClose($('.popup'));
    });
    
    $('.btn-delete-confirm').on('click', function() {
        window.location.href = '/';
       $.ajax({ 
           url: '/poll/' + data._id, 
           type: 'DELETE',
           success: function() { 
               console.log('deleted');
               $('.page').fadeOut(200);
                return false;
           }, 
            error: function(jqXHR, textStatus, errorThrown) { 
                console.log(textStatus);
            }
        }); 
    });
})