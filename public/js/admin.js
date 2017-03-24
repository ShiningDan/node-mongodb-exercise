$(function() {
    $('.del').click(function(event) {
        let target = $(event.target);
        let id = target.data('id');
        let tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE',
            url: '/admin/list?id=' + id,
        })
        .done(function(result) {
            if (result.success === 1) {
                if(tr.length > 0) {
                    tr.remove();
                }
            }
        })
    })
})