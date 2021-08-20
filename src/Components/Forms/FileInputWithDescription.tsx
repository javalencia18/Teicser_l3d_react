import React, { useState, useMemo, useRef } from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { Utils } from '../../Common/Utils/Utils';

export type acceptedFormat = "jpg" | "png" | "gif" | "jpeg" | "xls" | "xlsx";
interface Props {
	accept?: acceptedFormat[]
	label?: string
	errors?: string[]
	id: string
	onChange?: (e: File | null) => void
	onChangeDisplay?: (e: string | undefined ) => void
	src?: string
	name?: string
	multiple?: boolean
    display?: string
}

export const FileInputWithDescription = (props: Props) => {
	const { capitalize: caps } = useFullIntl();
	const [error, setError] = useState<boolean>(false);
	const input = useRef<HTMLInputElement>(null);

	const acceptFormat = useMemo( () => {
		if( props.accept && props.accept.length > 0 ){
			const accept = props.accept.reduce( ( acc , format ) => {
				return (
                    format === "xls" 
                    || format === "xlsx" 
                )
                    ? `${acc},.${format}` 
                    : `${acc},image/${format}`
			} , "" );
			return accept.substr(1, accept.length);
		}

		return "image/jpg,image/png,image/jpeg,image/git,.xls,.xlsx"; 
	}, [props.accept, props.accept?.length]);

    const openFileSelect = () => {
		input.current?.click();
	}

	return (
		<div>
			{props.label && (
				<label>
					<b>{caps(props.label)}:</b>
				</label>
			)}

            <div className='input-group'>
                <input type='text' className='form-control border rounded' 
                    onClick={ openFileSelect }
                    placeholder={caps('placeholders:file_not_selected')} 
                    style={{ cursor: 'pointer' }} 
                    defaultValue={ props.display ? props.display : ""} 
                    readOnly
                />
                <div 
                    className='input-group-append' 
                    style={{ cursor: 'pointer' }}
                >
                    <span 
                        className='input-group-text' 
                        onClick={() => {
                            if (props.onChangeDisplay) { props.onChangeDisplay(undefined); }
                            if (props.onChange) { props.onChange(null); }
                            if (input && input.current) input.current.value = "";
                        }}
                    >
                        <i className='text-danger text-center fas fa-trash' />
                    </span>

                    <input 
                        type='file' 
                        className='form-control border rounded' 
                        accept={acceptFormat}
                        style={{ height: '30px' }} 
                        ref={input} 
                        onChange={(e) => {
                            const files = e.target.files;
                            if(files  && files.length !== 0 ){
                                if (props.onChangeDisplay) { props.onChangeDisplay(files[0].name); }
                                if (props.onChange) { props.onChange(files[0]); }
                            }
                        }} 
                        hidden 
                    />
                </div>
            </div>
			{ error && 
				<div className="text-danger"> Formato invalido (validos: {props.accept && props.accept.join(", ").toUpperCase()})</div>
			}
		</div>
	);
};
