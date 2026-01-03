import { Component } from '../component';
import './avatar-input.scss';
import { tmpl } from './tmpl';

interface AvatarInputProps {
  labelText?: string;
  inputId?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  attrs?: Record<string, string>;
  events?: Record<string, (e: Event) => void>;
}

export class AvatarInput extends Component {
  private inputId: string;
  private fileInput: HTMLInputElement | null = null;

  constructor(props: AvatarInputProps = {}) {
    const {
      labelText = 'Загрузить аватар',
      inputId = 'avatarInput',
      accept = 'image/*',
      onChange,
      ...restProps
    } = props;

    super('div', {
      ...restProps,
      labelText,
      inputId,
      accept,
      onChange,
      attrs: {
        class: 'avatar-container',
        ...props.attrs,
      },
    });

    this.inputId = inputId;
  }

  componentDidMount() {
    this.fileInput = this.getContent()?.querySelector(`#${this.inputId}`) || null;

    if (this.fileInput && this._props.onChange) {
      this.fileInput.addEventListener('change', this._handleFileChange);
    }
  }

  private _handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;

    if (this._props.onChange) {
      this._props.onChange(file);
    }
  };

  public openFileDialog() {
    this.fileInput?.click();
  }

  public getFile(): File | null {
    return this.fileInput?.files?.[0] || null;
  }

  public clearFile() {
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }

  render() {
    return this.compile(tmpl, this._props);
  }
}
