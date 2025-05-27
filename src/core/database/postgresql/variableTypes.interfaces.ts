export interface MessageInterface{
	error:boolean;
	message?:unknown;
	rows?:unknown;
}

export interface WhereInterface{
	field:string,
	operator?:string,
	value:string
}

export interface OrderByInterface{
	field:string,
	order?:string
}
