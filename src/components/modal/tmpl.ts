export const tmpl = `
<div class="modal__overlay">
  <div class="modal__container">
    <h2 class="modal__title">{{{title}}}</h2>
    <div class="modal__content">
      <input type="text" class="modal__input" placeholder="{{{placeholder}}}" id="modal-input">
    </div>
    <div class="modal__footer">
      {{{submitBtn}}}
      {{{cancelBtn}}}
    </div>
  </div>
</div>
`;
