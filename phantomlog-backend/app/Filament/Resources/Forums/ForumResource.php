<?php

declare(strict_types=1);

namespace App\Filament\Resources\Forums;

use App\Filament\Resources\Forums\Pages\CreateForum;
use App\Filament\Resources\Forums\Pages\EditForum;
use App\Filament\Resources\Forums\Pages\ListForums;
use App\Filament\Resources\Forums\Pages\ViewForum;
use App\Filament\Resources\Forums\RelationManagers\ReportsRelationManager;
use App\Filament\Resources\Forums\Schemas\ForumForm;
use App\Filament\Resources\Forums\Schemas\ForumInfolist;
use App\Filament\Resources\Forums\Tables\ForumsTable;
use App\Models\Forum;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Override;
use UnitEnum;

final class ForumResource extends Resource
{
    #[Override]
    protected static ?string $model = Forum::class;

    #[Override]
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    #[Override]
    protected static string|UnitEnum|null $navigationGroup = 'Comunidad';

    #[Override]
    protected static ?string $recordTitleAttribute = 'title';

    #[Override]
    protected static ?string $modelLabel = 'Foro';

    #[Override]
    protected static ?string $pluralModelLabel = 'Foros';

    public static function getNavigationBadge(): ?string
    {
        return (string) Forum::query()->count();
    }

    public static function form(Schema $schema): Schema
    {
        return ForumForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ForumInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ForumsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            ReportsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListForums::route('/'),
            'create' => CreateForum::route('/create'),
            'view' => ViewForum::route('/{record}'),
            'edit' => EditForum::route('/{record}/edit'),
        ];
    }
}
