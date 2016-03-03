import $ from 'jquery'

$('.user-theme').on('click', (event) => {
  $.ajax({
    url: '/themes',
    method: 'POST',
    data: {
      channelId: event.target.name,
      userThemeId: event.target.value,
      checked: event.target.checked,
    // error: (jqXHR, textStatus, errorThrown) =>
    // success: (data, textStatus, jqXHR) =>
    }
  })
})
