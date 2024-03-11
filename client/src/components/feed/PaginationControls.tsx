'use client';
import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
    pageNumbers: number[];
    currentPage: number;
}

export default function PaginationControls({
    pageNumbers,
    currentPage,
}: PaginationControlsProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        isDisable={currentPage === 1}
                        href={{
                            pathname,
                            query: {
                                ...params,
                                page: currentPage - 1,
                            },
                        }}
                    />
                </PaginationItem>
                {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={{
                                pathname,
                                query: {
                                    ...params,
                                    page,
                                },
                            }}
                            isActive={page === currentPage ? true : false}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        isDisable={pageNumbers.length === currentPage}
                        href={{
                            pathname,
                            query: {
                                ...params,
                                page: currentPage + 1,
                            },
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
