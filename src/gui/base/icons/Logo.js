// @flow
import {assertMainOrNodeBoot} from "../../../api/common/Env"

assertMainOrNodeBoot()

export function getLogoSvg(highlightColor: string, textColor: string): string {
	return '<svg viewBox="0 0 1054.473 236.49" preserveAspectRatio="xMinYMid" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">'
		+ `<g style="fill:${textColor};fill-opacity:1" transform="translate(-132.628 -222.799)">
			<path d="M494.016 299.858H451.32v-8.082h94.178v8.082h-42.696v121.939h-8.785V299.858zM543.209 396.496v-66.943h8.434v65.889c0 14.057 6.15 20.908 20.206 20.908 12.827 0 23.544-6.676 34.965-17.57v-69.228h8.434v92.245h-8.434v-15.285c-10.191 9.662-22.139 17.219-35.668 17.219-19.152-.001-27.937-10.543-27.937-27.235zM652.319 401.24v-64.133h-16.165v-7.555h16.165v-33.56h8.434v33.56h24.071v7.555h-24.071v62.902c0 9.84 3.339 15.463 14.935 15.463 3.515 0 7.028-.352 9.664-1.23v7.906c-2.987.527-6.501.879-10.366.879-15.287 0-22.667-6.15-22.667-21.787zM703.27 400.537c0-17.57 14.935-30.749 63.43-38.831v-5.623c0-14.056-7.38-21.084-20.03-21.084-15.287 0-25.478 5.974-35.845 15.287l-4.919-5.271c11.421-10.542 23.192-17.395 40.938-17.395 19.152 0 28.289 10.894 28.289 27.937v43.399c0 11.246.703 18.097 2.636 22.841h-8.961c-1.23-3.865-2.108-8.434-2.108-13.705-11.245 9.664-23.545 15.287-37.426 15.287-16.868 0-26.004-8.785-26.004-22.842zm63.429-.703v-31.803c-44.98 7.907-54.996 18.976-54.996 31.978 0 10.367 6.853 15.99 18.273 15.99 13.706.001 26.18-5.974 36.723-16.165z" />
 			<path d="M803.951 421.797v-92.772h15.286v13.881c8.083-7.907 19.68-15.813 34.79-15.813 17.746 0 27.41 10.191 27.41 27.762v66.943h-15.111v-63.604c0-12.299-5.271-18.098-17.043-18.098-11.069 0-20.382 5.798-30.046 14.935v66.768h-15.286zM903.572 375.411c0-31.978 20.382-48.319 43.224-48.319 22.666 0 43.048 16.341 43.048 48.319 0 31.802-20.382 48.319-43.048 48.319s-43.224-16.517-43.224-48.319zm70.986 0c0-19.328-9.313-35.316-27.762-35.316-17.746 0-27.937 14.408-27.937 35.316 0 19.679 9.137 35.493 27.937 35.493 17.57 0 27.762-14.233 27.762-35.493zM1019.535 399.307V341.5h-16.165v-12.475h16.165v-33.032h15.11v33.032h24.072V341.5h-24.072v54.469c0 9.84 3.163 14.76 14.408 14.76 3.338 0 7.028-.527 9.488-1.23v12.475c-2.636.527-8.435 1.055-13.178 1.055-19.503-.002-25.828-7.556-25.828-23.722zM1075.057 399.834c0-18.801 15.988-32.154 62.023-38.655v-4.217c0-11.597-6.149-17.219-17.57-17.219-14.057 0-24.423 6.15-33.56 14.056l-7.907-9.488c10.718-9.839 24.599-17.219 43.048-17.219 22.139 0 30.924 11.597 30.924 30.924v40.939c0 11.246.703 18.097 2.636 22.841h-15.462c-1.229-3.865-2.108-7.555-2.108-12.826-10.366 9.664-21.963 14.232-35.844 14.232-15.99.001-26.18-8.432-26.18-23.368zm62.023-2.108v-26.004c-35.316 5.623-47.089 14.232-47.089 25.829 0 8.961 5.974 13.706 15.638 13.706 12.299-.001 22.842-5.097 31.451-13.531z" />
	       </g>`
		+ `<path style="fill:${highlightColor}" d="M22.875 0C10.235 0 0 10.246 0 22.872v211.23c0 .801.046 1.608.123 2.388 8.5-3.167 17.524-6.629 27.054-10.436 66.336-26.48 120.569-48.994 120.618-74.415 0-.814-.056-1.636-.172-2.458-3.43-25.098-63.407-32.879-63.324-44.381.007-.611.18-1.25.548-1.889 7.205-12.619 35.743-12.015 46.253-12.907 10.519-.913 35.206-.724 36.399-8.244.035-.232.057-.463.057-.695.028-6.987-16.977-9.726-16.977-9.726s20.635 3.083 20.579 11.11c0 .393-.048.8-.158 1.214-2.222 8.624-20.379 10.246-32.386 10.835-11.356.569-28.648 1.861-28.707 7.408-.007.323.049.66.165 1.004 2.71 8.11 66.09 12.015 106.64 33.061 23.335 12.099 34.94 32.422 40.263 53.418V22.869c0-12.626-10.243-22.872-22.869-22.872H22.875z"/>`
		+ `</svg>`
}
