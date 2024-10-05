import { serialize } from 'cookie';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    const { name, value, time} = await request.json();
    try {
        const token = buildToken(value, time);
        const cookie = serialize(name, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: time,
            path: '/'
        });
        const headers = new Headers({
            'Set-Cookie': cookie,
            'Content-Type': 'application/json',
        });
        return new Response(JSON.stringify({status: true}), { headers });
    } catch (error) {
        return new Response(JSON.stringify({ status: false, error: error }), { status: 500 });
    }
}

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const name = queryParams.get('name');
    const cookiesList = cookies();
    const token = cookiesList.get(name)?.value;
    let statusCode = 404;
    if (token !== undefined) {
        try {
            const value = decodeToken(token);
            statusCode = 200;
            return new Response(JSON.stringify(value), { status: statusCode });
        } catch (error) {
            statusCode = 500;
            return new Response(JSON.stringify({ error: error }), { status: statusCode });
        }
    } else {
        statusCode = 404;
        return new Response(JSON.stringify({ error: "Cookie not found" }), { status: statusCode });
    }
}

export async function DELETE(request) {
    const { name } = await request.json();

    const cookie = serialize( name, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/'
    });
    const headers = new Headers({
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
    });

    return new Response(JSON.stringify({status: true}), { headers });
}

const buildToken = (value, time) => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY || 'default-jwt-secret';
        const token = jwt.sign({value: value}, secretKey, { expiresIn: time });
        return token;
    } catch (error) {
        throw new Error('Error building token: ' + error);
    }

};

const decodeToken = (token) => {
    const secretKey = process.env.JWT_SECRET_KEY || 'default-jwt-secret';
    if (token) {
        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (error) {
            throw new Error('Error decoding token: ' + error);
        }
    } else {
        throw new Error('No token provided');
    }
}