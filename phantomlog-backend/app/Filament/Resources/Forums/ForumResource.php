<?php

namespace App\Filament\Resources\Forums;

use App\Filament\Resources\Forums\Pages\CreateForum;
use App\Filament\Resources\Forums\Pages\EditForum;
use App\Filament\Resources\Forums\Pages\ListForums;
use App\Filament\Resources\Forums\Schemas\ForumForm;
use App\Filament\Resources\Forums\Tables\ForumsTable;
use App\Filament\Resources\Forums\Schemas\ForumInfolist;
use App\Models\Forum;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ForumResource extends Resource
{
    protected static ?string $model = Forum::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static ?string $recordTitleAttribute = 'title';

    protected static ?string $modelLabel = 'Foro';

    protected static ?string $pluralModelLabel = 'Foros';

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
            RelationManagers\ReportsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListForums::route('/'),
            'create' => CreateForum::route('/create'),
            'view' => Pages\ViewForum::route('/{record}'),
            'edit' => EditForum::route('/{record}/edit'),
        ];
    }
}
