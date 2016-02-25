$('.user-theme').on 'click', (event) ->
  $.ajax
    url: '/themes'
    method: 'POST'
    data:
      channelId: @.name
      userThemeId: @.value
      checked: @.checked
    error: (jqXHR, textStatus, errorThrown) ->
    success: (data, textStatus, jqXHR) ->
