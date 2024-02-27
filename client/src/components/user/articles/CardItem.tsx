import React, { Fragment } from 'react';

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import moment from 'moment';
import { Paragraph } from '@/components/ui/typography';

export default function CardItem({ data }: { data: any }) {
    const relativeTime = moment(data.createdAt).fromNow();
    return (
        <Fragment>
            <Card className="border-b">
                <CardHeader className="py-2">
                    <CardTitle>{data.title}</CardTitle>
                    <CardDescription>
                        {data.description || null}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="pb-2">
                    <Paragraph>{relativeTime}</Paragraph>
                </CardFooter>
            </Card>
        </Fragment>
    );
}
