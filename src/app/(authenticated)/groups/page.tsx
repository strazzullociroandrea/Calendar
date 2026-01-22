"use client";
import {Button} from "@/components/ui/button"
import {Plus, UserPlus} from "lucide-react";
import {GroupsView} from "@/components/groups/groups-view";
import {useState} from "react";
import {CreateGroup} from "@/components/groups/create-group";
import {JoinGroup} from "@/components/groups/join-group";

export default function GroupsPage() {

    const [isOpenCreateGroup, setIsOpenCreateGroup] = useState(false);
    const [isOpenJoinGroup, setIsOpenJoinGroup] = useState(false);

    return (
        <div className="min-h-screen">
            <div className="container mx-auto h-full px-4 sm:px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-light text-foreground flex-1">
                        I tuoi gruppi
                    </h1>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="min-w-[100px] font-light shadow-xs"
                            onClick={() => setIsOpenJoinGroup(true)}
                        >
                            <UserPlus size={15}/>
                            <span>Unisciti</span>
                        </Button>

                        <Button
                            variant="secondary"
                            className="min-w-[100px] font-light shadow-xs"
                            onClick={() => setIsOpenCreateGroup(true)}
                        >
                            <Plus size={15}/>
                            <span>Nuovo gruppo</span>
                        </Button>
                        <CreateGroup open={isOpenCreateGroup} setOpen={setIsOpenCreateGroup}/>
                        <JoinGroup open={isOpenJoinGroup} setOpen={setIsOpenJoinGroup}/>
                    </div>
                </div>
                <GroupsView/>
            </div>

        </div>
    );
}