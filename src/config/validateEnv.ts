/* eslint-disable @typescript-eslint/naming-convention */
import Joi from 'joi';

const schema = Joi.object({
	BOT_TOKEN: Joi.string().required(),

	JUBILEU_ID: Joi.number().unsafe().required(),
	JUBILEU_SERVER: Joi.number().unsafe().required(),
	READY_CHANNEL_ID: Joi.number().unsafe().required(),
	SERVERS_CHANNEL_ID: Joi.number().unsafe().required(),
	SERVERS_CONNECTED_CHANNEL_ID: Joi.number().unsafe().required(),
	REPORTS_CHANNEL_ID: Joi.number().unsafe().required(),

	LAVALINK_HOST: Joi.string().required(),
	LAVALINK_PORT: Joi.number().required(),

	SPOTIFY_CLIENT_ID: Joi.string().required(),
	SPOTIFY_SECRET: Joi.string().required(),
	SPOTIFY_DC_COOKIE: Joi.string().required(),

	GENIUS_CLIENT_ID: Joi.string().required(),
	GENIUS_CLIENT_SECRET: Joi.string().required(),
	GENIUS_ACCESS_TOKEN: Joi.string().required(),

	PO_TOKEN: Joi.string().required(),
	VISITOR_DATA: Joi.string().required(),
}).options({
	abortEarly: true,
	messages: { 'any.required': 'The { #label } environment variable is not defined!' },
	allowUnknown: true,
});

try {
	Joi.assert(process.env, schema);
} catch (error) {
	throw new Error((error as ValidationError).details[0].message);
}

interface ValidationError {
	details: { message: string }[];
}
