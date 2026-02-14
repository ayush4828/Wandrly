// (() => {
//   'use strict'

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   const forms = document.querySelectorAll('.needs-validation')

//   // Loop over them and prevent submission
//   Array.from(forms).forEach(form => {

//     form.addEventListener('submit', event => {
//       if (!form.checkValidity()) {
//         event.preventDefault()
//         event.stopPropagation()
//       }

//       form.classList.add('was-validated')
//     }, false)
//   })
// })()


(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

      const commentField = document.getElementById("comment")

      // Trim value before validation
      if (commentField) {
        commentField.value = commentField.value.trim()
      }

      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')

    }, false)
  })
})()