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
    fadeAndRedirect('.logout', '/logout');
    fadeAndRedirect('.login', '/login');
    
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
    
    $("input[name='data-choice']").click(function(){
        var chosen = $("input[name='data-choice']:checked").val();
        $('#data-display').val(chosen);
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
    	$('.btn-close').on("click", function() {
    		if ($(".formElementError").is(':visible')) {
    			$(".formElementError").remove();
    		}
    		$(popup).hide();
    	});
    }
    
    $('.btn-share').on("click", function() {
    	popupOpenClose($(".popup"));
    });
    
    $('.btn-delete').on('click', function() {
        $.ajax({
            url: '/',
            type: 'DELETE',
            success: function(result) {
                // Do something with the result
            }
        });
    });
})