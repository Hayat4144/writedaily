'use client';
import { CalculateAverageTimeToRead, serialize } from '@/lib/utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface props {
    data: any;
}

export default function ArticleHeader({ data }: props) {
    const [readTime, setReadTime] = useState<number>();
    useEffect(() => {
        const articleText = serialize(data.content || []);
        setReadTime(CalculateAverageTimeToRead(articleText, 200));
    }, []);

    const relativeTime = moment(data.createdAt).fromNow();

    return (
        <p className="text-muted-foreground text-sm -mt-2">
            {readTime} min read. {relativeTime}
        </p>
    );
}
