<script setup>
import { IconBellFilled, IconFlame } from '@tabler/icons-vue';
import AppButton from './AppButton.vue';
import NavLink from './NavLink.vue';
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div class="flex items-center space-x-6">
        <Link href="/" class="flex space-x-1">
            <IconFlame class="size-6 text-teal-500" stroke-width="2.5" />
            <p class="text-xl font-black">SanctuaryForge</p>
        </Link>

        <div class="flex flex-1 items-center space-x-1">
            <NavLink
                :href="route('items.index')"
                :active="route().current('items.index')"
                >Items</NavLink
            >
            <NavLink href="#!">Guides</NavLink>
        </div>

        <div class="flex items-center space-x-2">
            <AppButton outline color="white">My Guides</AppButton>

            <div class="rounded-xl bg-white/10 p-2 ring-1 ring-white/10">
                <IconBellFilled class="size-4 text-zinc-400" stroke-width="2" />
            </div>

            <div>
                <img
                    src="//picsum.photos/100"
                    alt=""
                    class="block size-8 rounded-lg ring-1 ring-white/20"
                />
            </div>
        </div>
    </div>
</template>
