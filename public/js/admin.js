$(function() {
    $('.del').click(function(event) {
        let target = $(event.target);
        let id = target.data('id');
        let tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE',
            url: '/admin/movie/list?id=' + id,
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

$('#douban').blur(function(event) {
    let douban = $(this);
    let id = douban.val();

    if(id) {
        $.ajax({
            url: 'https://api.douban.com/v2/movie/subject/' + id,
            cache: true,
            type: 'get',
            dataType: `jsonp`,
            crossDomain: true,
            jsonp: 'callback',
            success: function(data) {
                $('#inputTitle').val(data.title);
                $('#inputDoctor').val(data.directors[0].name);
                $('#inputYear').val(data.year);
                $('#inputCountry').val(data.countries[0]);
                $('#inputSummary').val(data.summary);
                $('#inputPoster').val(data.images.large);
            },
        });
    }
});