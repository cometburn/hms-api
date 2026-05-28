export interface MailerPayload {
    to?: string;
    subject?: string;
    message?: string;
    [key: string]: unknown;
}

export const sendMail = async (payload: MailerPayload) => {
    const url = process.env.MAILER_URL;

    if (!url) {
        throw new Error("MAILER_URL is missing");
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Mailer request failed (${response.status}): ${errorText}`
        );
    }

    return {
        success: true,
        status: response.status,
    };
};