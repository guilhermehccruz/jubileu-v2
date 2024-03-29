import Joi from 'joi';

const schema = Joi.object({
	BOT_TOKEN: Joi.string().required(),

	JUBILEU_SERVER: Joi.number().unsafe().optional(),
	READY_CHANNEL_ID: Joi.number().unsafe().optional(),
	SERVERS_CHANNEL_ID: Joi.number().unsafe().optional(),
	SERVERS_CONNECTED_CHANNEL_ID: Joi.number().unsafe().optional(),

	LAVA_HOST: Joi.string().required(),
	LAVA_PORT: Joi.number().required(),
	LAVA_PASSWORD: Joi.string().allow('').required(),

	SPOTIFY_CLIENT_ID: Joi.string().required(),
	SPOTIFY_SECRET: Joi.string().required(),
}).options({
	abortEarly: true,
	messages: { 'any.required': 'The { #label } environment variable is not defined!' },
	allowUnknown: true,
});

try {
	Joi.assert(process.env, schema);
} catch (error) {
	throw new Error((error as IValidationError).details[0].message);
}

interface IValidationError {
	details: { message: string }[];
}
