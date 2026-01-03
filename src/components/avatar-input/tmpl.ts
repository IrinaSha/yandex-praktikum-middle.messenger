export const tmpl = `
      <div class="file-avatar" {{#if attrs}}{{#each attrs}}{{@key}}="{{this}}" {{/each}}{{/if}}>
  <div class="file-avatar__preview">
    {{#if avatar}}
      <img src="{{avatar}}" alt="Avatar" class="file-avatar__image" />
    {{else}}
      <div class="file-avatar__placeholder">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#EFEFEF"/>
          <path d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM20 15C22.21 15 24 16.79 24 19C24 21.21 22.21 23 20 23C17.79 23 16 21.21 16 19C16 16.79 17.79 15 20 15ZM20 28C16.67 28 13.8 26.34 12 23.84C12.03 21.22 17.33 19.75 20 19.75C22.66 19.75 27.97 21.22 28 23.84C26.2 26.34 23.33 28 20 28Z" fill="#999999"/>
        </svg>
      </div>
    {{/if}}
  </div>

  <label for="{{inputId}}" class="file-avatar__label">
    {{label}}
  </label>

  <input
    type="file"
    id="{{inputId}}"
    name="{{{inputName}}}"
    accept="{{accept}}"
    class="file-avatar__input"
  />
</div>
    `;
