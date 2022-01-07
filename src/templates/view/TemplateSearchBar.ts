import m, {Children, Component, Vnode} from "mithril"
import type {TranslationKey} from "../../misc/LanguageViewModel"
import {lang} from "../../misc/LanguageViewModel"
import {inputLineHeight, px} from "../../gui/size"
import type {keyHandler} from "../../misc/KeyManager"
import {theme} from "../../gui/theme"
import type {lazy} from "@tutao/tutanota-utils"
import Stream from "mithril/stream";

export type TemplateSearchBarAttrs = {
	value: Stream<string>
	placeholder?: TranslationKey | lazy<string>
	oninput?: (value: string, input: HTMLInputElement) => unknown
	keyHandler?: keyHandler
}

export class TemplateSearchBar implements Component<TemplateSearchBarAttrs> {
	domInput: HTMLInputElement

	view(vnode: Vnode<TemplateSearchBarAttrs>): Children {
		const a = vnode.attrs
		return m(
			".inputWrapper.pt-xs.pb-xs",
			{
				style: {
					"border-bottom": `1px solid ${theme.content_border}`,
				},
			},
			this._getInputField(a),
		)
	}

	_getInputField(a: TemplateSearchBarAttrs): Children {
		return m("input.input", {
			placeholder: a.placeholder && lang.getMaybeLazy(a.placeholder),
			oncreate: vnode => {
				this.domInput = vnode.dom as HTMLInputElement
				this.domInput.value = a.value()
				this.domInput.focus()
			},
			onkeydown: (e: KeyboardEvent) => {
				let key = {
					keyCode: e.which,
					key: e.key,
					ctrl: e.ctrlKey,
					shift: e.shiftKey,
				}
				return a.keyHandler != null ? a.keyHandler(key) : true
			},
			oninput: () => {
				a.value(this.domInput.value)
				a.oninput && a.oninput(this.domInput.value, this.domInput)
			},
			style: {
				lineHeight: px(inputLineHeight),
			},
		})
	}
}