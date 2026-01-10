export const tmpl = `
<div class="file-avatar">
  <label class="file-avatar__label" for="{{inputId}}">
    <div class="file-avatar__preview">
      {{#if avatar}}
        <img src="{{avatar}}" alt="Avatar" class="file-avatar__image">
      {{else}}
        <div class="file-avatar__placeholder">
          <span class="file-avatar__text">Поменять<br>аватар</span>
        </div>
      {{/if}}
    </div>
  </label>
  <input
    type="file"
    id="{{inputId}}"
    name="{{inputName}}"
    accept="{{accept}}"
    class="file-avatar__input"
  >
</div>
`;
