import { Component } from '../component';
import './avatar-input.scss';
import { tmpl } from './tmpl';

interface AvatarInputProps {
  label?: string;
  inputId?: string;
  inputName?: string;
  accept?: string;
  avatar?: string;
  onChange?: (file: File | null) => void;
  attrs?: Record<string, string>;
}

export class AvatarInput extends Component {
  private inputId: string;

  private fileInput: HTMLInputElement | null = null;

  constructor(props: AvatarInputProps = {}) {
    const {
      label = 'Поменять аватар',
      inputId = 'avatarInput',
      inputName = 'avatar',
      accept = 'image/*',
      avatar = '',
      onChange,
      ...restProps
    } = props;

    super('div', {
      ...restProps,
      label,
      inputId,
      inputName,
      accept,
      avatar,
      events: {
        change: (event: Event) => {
          const target = event.target as HTMLInputElement;
          if (target.id === inputId && target.files?.[0]) {
            const file = target.files[0];

            onChange?.(file);

            const reader = new FileReader();

            reader.onload = (e) => {
              this.setProps({ avatar: e.target?.result as string });
            };

            reader.readAsDataURL(file);
          }
        },
      },
    });

    this.inputId = inputId;
  }

  componentDidMount() {
    this.fileInput = this.getContent()?.querySelector(`#${this.inputId}`) || null;
  }

  public openFileDialog() {
    this.fileInput?.click();
  }

  public getFile(): File | null {
    return this.fileInput?.files?.[0] || null;
  }

  public clearFile() {
    if (this.fileInput) {
      this.fileInput.value = '';
      this.setProps({ avatar: '' });
    }
  }

  public setAvatar(url: string) {
    this.setProps({ avatar: url });
  }

  render() {
    return this.compile(tmpl, this._props);
  }
}
