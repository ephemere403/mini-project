function updatePublications() {
    $.ajax({
      url: '/api/publications',
      success: function(data) {
        var html = '';
        data.forEach(function(publication) {
          html += '<div class="card card-tweet">';
          html += '<div class="card-tweet-header d-flex align-items-center">';
          // Add the rest of the publication HTML code here
          html += '</div></div>';
        });
        $('#publications-container').html(html);
      }
    });
  }