import React from 'react';

export default function page({
    searchParams,
}: {
    searchParams: {
        error: string;
    };
}) {
    return <div>{searchParams.error}</div>;
}
