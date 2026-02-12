export const tmpl = `
<div class="chat-page-container">
  <div class="chat-list-container">
    <div class="chat-header">
      <h1>{{title}}</h1>
      {{{link}}}
    </div>
    <div class="chat-toolbar">
      {{{addChatBtn}}}
    </div>
    {{{chatList}}}
  </div>

  <div class="messages-section {{messagesSectionClass}}">
    <div class="chat-toolbar">
      <div class="chat-toolbar__header">
        <span class="chat-toolbar__title">{{currentChatTitle}}</span>
      </div>
      <div class="chat-toolbar__actions">
        {{{deleteChatBtn}}}
        {{{addUserBtn}}}
        {{{removeUserBtn}}}
      </div>
    </div>

    <div class="messages-list-wrapper">
      {{{messagesList}}}
    </div>

    <div class="chat-input-footer">
      {{{form}}}
    </div>
  </div>
</div>
`;
