export const getParamsValue = url => {
	if (!url) {
		return {};
	}
	const searchParams = new URLSearchParams(url);
	const params = [...searchParams.entries()];
	const allParamsObject = params.reduce(
		(allParam, [key, value]) => ({
			...allParam,
			[key]: value,
		}),
		{},
	);
	return allParamsObject;
};