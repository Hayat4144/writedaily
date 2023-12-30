import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import Iconwithtext from '@/components/IconwithText';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function ToogleLink() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    asChild
                    className="mx-0"
                    onClick={() => {
                        const url = 'http://www.google.com';
                    }}
                >
                    <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="hover:dark:bg-[#3b3b40] rounded-none mx-0"
                    >
                        <Iconwithtext
                            icons={<Icons.link size={15} />}
                            text="Link"
                            className="w-full"
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add Link</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
